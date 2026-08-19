import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Popover,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Tooltip,
    Alert,
    Stack,
    TextareaAutosize
} from '@mui/material';
import {
    LocalOffer as TagIcon,
    Close as CloseIcon,
    KeyboardControlKey as CtrlIcon,
    Visibility as PreviewIcon,
    SaveAltSharp,
    Save
} from '@mui/icons-material';

// انواع داده‌ها (Types)
export interface Tag {
    name: string;
    fullTag: string;
    description?: string;
    defaultValue?: string;
    position?: number;
}

export interface SmsInfo {
    charCount: number;
    smsCount: number;
    remainingChars: number;
    isUnicode: boolean;
    encoding: 'GSM-7' | 'UCS-2';
}

export interface TemplateEditorProps {
    initialTemplate?: string;
    availableTags?: Tag[];
    onTagsChange?: (tags: Tag[]) => void;
    onTextChange?: (text: string) => void;
    onSmsInfoChange?: (info: SmsInfo) => void;
    placeholder?: string;
    maxLength?: number;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    onSaveTemplate?: () => void,
    disableOperationButtons?: boolean
}

// تابع محاسبه پیامک (پیشرفته با پشتیبانی از یونیکد)
const calculateSmsInfo = (text: string, tags: Tag[]): SmsInfo => {
    // جایگزینی تگ‌ها با مقادیر پیش‌فرض برای محاسبه دقیق
    let previewText = text;
    tags.forEach(tag => {
        const sampleValue = tag.defaultValue || `[${tag.name}]`;
        previewText = previewText.replace(new RegExp(tag.fullTag, 'g'), sampleValue);
    });

    const length = previewText.length;

    // تشخیص یونیکد
    let isUnicode = false;
    for (let i = 0; i < length && i < 100; i++) {
        const code = previewText.charCodeAt(i);
        if (code > 127) {
            isUnicode = true;
            break;
        }
    }

    const charsPerSms = isUnicode ? 70 : 160;
    const smsCount = length === 0 ? 0 : Math.ceil(length / charsPerSms);
    const remainingChars = smsCount === 0 ? charsPerSms :
        (smsCount * charsPerSms) - length;

    return {
        charCount: length,
        smsCount,
        remainingChars,
        isUnicode,
        encoding: isUnicode ? 'UCS-2' : 'GSM-7'
    };
};

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
    initialTemplate = '',
    availableTags = [],
    onTagsChange,
    onTextChange,
    onSmsInfoChange,
    placeholder = 'متن خود را وارد کنید ...',
    maxLength,
    disabled = false,
    error = false,
    helperText,
    onSaveTemplate,
    disableOperationButtons = false
}) => {

    const [text, setText] = useState<string>(initialTemplate);
    const [tags, setTags] = useState<Tag[]>([]);

    const [smsInfo, setSmsInfo] = useState<SmsInfo>({
        charCount: 0,
        smsCount: 0,
        remainingChars: 160,
        isUnicode: false,
        encoding: 'GSM-7'
    });

    useEffect(() => {
        setText(initialTemplate);
    }, [initialTemplate])


    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [tagSelectorAnchor, setTagSelectorAnchor] = useState<HTMLElement | null>(null);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // استخراج تگ‌ها از متن
    const extractTags = useCallback((content: string): Tag[] => {
        const tagRegex = /{{(.*?)}}/g;
        const foundTags: Tag[] = [];
        let match;

        while ((match = tagRegex.exec(content)) !== null) {
            const tagName = match[1];
            const existingTag = availableTags?.find(t => t.name === tagName);

            foundTags.push({
                name: tagName,
                fullTag: match[0],
                description: existingTag?.description,
                defaultValue: existingTag?.defaultValue,
                position: match.index
            });
        }

        return foundTags;
    }, [availableTags]);

    // به‌روزرسانی اطلاعات
    useEffect(() => {
        const extractedTags = extractTags(text);
        setTags(extractedTags);
        onTagsChange?.(extractedTags);

        const newSmsInfo = calculateSmsInfo(text, extractedTags);
        setSmsInfo(newSmsInfo);
        onSmsInfoChange?.(newSmsInfo);
        onTextChange?.(text);
    }, [text, extractTags, onTagsChange, onSmsInfoChange, onTextChange]);

    // هندل تغییر متن
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        if (maxLength && newText.length > maxLength) return;
        setText(newText);
        setCursorPosition(e.target.selectionStart);
    };

    // درج تگ در موقعیت مکان‌نما
    const insertTag = (tag: Tag) => {
        const tagText = `{{${tag.name}}}`;
        const start = cursorPosition;
        const end = cursorPosition + tagText.length;

        const newText = text.slice(0, cursorPosition) + tagText + text.slice(cursorPosition);
        setText(newText);

        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(end, end);
                setCursorPosition(end);
            }
        }, 0);

        setTagSelectorAnchor(null);
    };

    // هندل کلیدهای میانبر
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            setTagSelectorAnchor(textareaRef.current);
        }
        if (e.key === 'Escape') {
            setTagSelectorAnchor(null);
            setShowPreview(false);
        }
    };

    // دریافت رنگ بر اساس تعداد کاراکتر باقیمانده
    const getRemainingColor = (): string => {
        if (smsInfo.remainingChars < 10) return '#d32f2f';
        if (smsInfo.remainingChars < 30) return '#ed6c02';
        return '#2e7d32';
    };

    // پیش‌نمایش متن نهایی
    const getPreviewText = (): string => {
        let preview = text;
        tags.forEach(tag => {
            const value = tag.defaultValue || `[${tag.name}]`;
            preview = preview.replace(new RegExp(tag.fullTag, 'g'), value);
        });
        return preview;
    };

    return (
        <Box sx={{ width: '100%', position: 'relative' }}>
            {/* هدر اطلاعات */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1, px: 0.5 }}
            >
                <Stack direction="row" spacing={2}>
                    <Typography variant="caption" color="text.secondary">
                        📝 {smsInfo.charCount.toLocaleString()} کاراکتر
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        📱 {smsInfo.smsCount} پیامک
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ color: getRemainingColor(), fontWeight: 500 }}
                    >
                        ⚡ {smsInfo.remainingChars} کاراکتر باقیمانده
                    </Typography>
                    {smsInfo.isUnicode && (
                        <Chip
                            label="یونیکد"
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '10px' }}
                        />
                    )}

                    {maxLength && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            حداکثر {maxLength.toLocaleString()} کاراکتر مجاز است
                        </Typography>
                    )}
                </Stack>

                {/*operation button*/}
                <Stack direction="row" spacing={1} display={disableOperationButtons ? 'none' : 'flex'}>
                    <Tooltip title="ذخیره قالب">
                        <IconButton
                            size="small"
                            onClick={onSaveTemplate}
                            disabled={disabled}
                        >
                            <Save fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="درج تگ">
                        <IconButton
                            size="small"
                            onClick={() => setTagSelectorAnchor(textareaRef.current)}
                            disabled={disabled}
                        >
                            <TagIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="پیش‌ نمایش با جایگزینی تگ‌ها">
                        <IconButton
                            size="small"
                            onClick={() => setShowPreview(!showPreview)}
                            disabled={disabled}
                        >
                            <PreviewIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>


            </Stack>

            {/* Textarea اصلی */}
            <TextareaAutosize
                ref={textareaRef}
                minRows={4}
                maxRows={12}
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                onClick={(e) => setCursorPosition(e.currentTarget.selectionStart)}
                onKeyUp={(e) => setCursorPosition(e.currentTarget.selectionStart)}
                disabled={disabled}
                placeholder={placeholder}
                style={{
                    width: "100%",
                    borderRadius: "12px",
                    padding: "12px",
                    paddingBottom: "48px",
                    outline: "none",
                    fontSize: "16px",
                    border: `1px solid ${error ? '#d32f2f' : '#e0e0e0'}`,
                    fontFamily: "monospace",
                    resize: "vertical",
                    lineHeight: "1.5",
                    backgroundColor: disabled ? "#f5f5f5" : "white",
                    transition: "border-color 0.2s"
                }}
            />

            {/* نمایش تگ‌های موجود */}
            {/* {tags.length > 0 && (
                <Stack
                    direction="row"
                    justifyContent={'center'}
                    spacing={0.5}
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 12,
                        flexWrap: 'wrap',
                        gap: 0.5
                    }}
                >
                    {tags.map((tag, idx) => (
                        <Chip
                            key={idx}
                            label={tag.fullTag}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{
                                height: 24,
                                fontSize: '11px',
                                backgroundColor: 'rgba(25, 118, 210, 0.08)'
                            }}
                        />
                    ))}
                </Stack>
            )} */}

            {/* منوی انتخاب تگ */}
            <Popover
                open={Boolean(tagSelectorAnchor)}
                anchorEl={tagSelectorAnchor}
                onClose={() => setTagSelectorAnchor(null)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        width: 280,
                        maxHeight: 320,
                        borderRadius: 2,
                        boxShadow: 3
                    }
                }}
            >
                <Box sx={{ p: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                        تگ‌های قابل استفاده
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        با کلیک روی هر تگ در متن درج می‌شود
                    </Typography>
                </Box>
                <List dense sx={{ p: 0 }}>
                    {availableTags?.map((tag) => (
                        <Tooltip title={tag.defaultValue}>
                            <ListItem key={tag.name} disablePadding>
                                <ListItemButton onClick={() => insertTag(tag)} >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: 0.1 }}>
                                                <Chip
                                                    label={`{{${tag.name}}}`}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ fontFamily: 'monospace' }}
                                                />
                                                {tag.description && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {tag.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </Popover>

            {/* پیش‌نمایش */}
            <Popover
                open={showPreview}
                anchorEl={textareaRef.current}
                onClose={() => setShowPreview(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                PaperProps={{
                    sx: {
                        width: 400,
                        maxWidth: '90vw',
                        p: 2,
                        mt: 1,
                        borderRadius: 2
                    }
                }}
            >
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    پیش‌نمایش متن نهایی
                </Typography>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 1.5,
                        bgcolor: '#f9f9f9',
                        maxHeight: 200,
                        overflow: 'auto',
                        fontSize: '14px',
                        lineHeight: 1.5
                    }}
                >
                    {getPreviewText() || <em>متن وارد نشده است</em>}
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    تگ‌ها با مقادیر پیش‌فرض جایگزین شده‌اند
                </Typography>
            </Popover>

            {/* خطا و راهنما */}
            {(error || helperText) && (
                <Alert
                    severity={error ? "error" : "info"}
                    sx={{ mt: 1, py: 0, '& .MuiAlert-message': { py: 0.5 } }}
                >
                    {helperText}
                </Alert>
            )}


        </Box>
    );
};

// هوک سفارشی برای مدیریت قالب
export const useTemplateEditor = () => {
    const [template, setTemplate] = useState<string>('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [smsInfo, setSmsInfo] = useState<SmsInfo | null>(null);

    const replaceTags = useCallback((variables: Record<string, string>): string => {
        let result = template;
        tags.forEach(tag => {
            const value = variables[tag.name] || tag.defaultValue || '';
            result = result.replace(new RegExp(tag.fullTag, 'g'), value);
        });
        return result;
    }, [template, tags]);

    const validateTemplate = useCallback((): boolean => {
        const missingTags = tags.filter(tag => !tag.defaultValue);
        return missingTags.length === 0;
    }, [tags]);

    return {
        template,
        setTemplate,
        tags,
        setTags,
        smsInfo,
        setSmsInfo,
        replaceTags,
        validateTemplate
    };
};

export default TemplateEditor;