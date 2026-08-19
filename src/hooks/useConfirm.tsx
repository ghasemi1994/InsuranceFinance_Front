import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider } from '@mui/material';

interface ConfirmOptions {
    title?: string;
    content?: React.ReactNode;
    confirmationText?: string;
    cancellationText?: string;
    allowClose?: boolean;
}

const useConfirm = () => {
    const [state, setState] = useState<{
        isOpen: boolean;
        options: ConfirmOptions;
        resolver?: (confirmed: boolean) => void;
    }>({
        isOpen: false,
        options: {},
    });

    const confirm = (options: ConfirmOptions = {}): Promise<boolean> => {
        return new Promise((resolve) => {
            setState({
                isOpen: true,
                options,
                resolver: resolve,
            });
        });
    };

    const handleClose = () => {
        if (state.options.allowClose !== false) {
            setState({ ...state, isOpen: false });
            state.resolver?.(false);
        }
    };

    const handleConfirm = () => {
        setState({ ...state, isOpen: false });
        state.resolver?.(true);
    };

    const handleCancel = () => {
        setState({ ...state, isOpen: false });
        state.resolver?.(false);
    };

    // اینجا دیالوگ را مستقیماً رندر می‌کنیم
    const ConfirmDialog = () => (
        <Dialog
            open={state.isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
        >
            {state.options.title && (
                <Divider>
                    <DialogTitle id="alert-dialog-title">
                        {state.options.title}
                    </DialogTitle>
                </Divider>
            )}
            <DialogContent>
                {typeof state.options.content === 'string' ? (
                    <p>{state.options.content}</p>
                ) : (
                    state.options.content
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} variant='outlined'>
                    {state.options.cancellationText || 'انصراف'}
                </Button>
                <Button
                    onClick={handleConfirm}
                    color="primary"
                    variant="contained"
                    autoFocus
                >
                    {state.options.confirmationText || 'تایید'}
                </Button>
            </DialogActions>
        </Dialog>
    );

    return {
        confirm,
        ConfirmDialog,
    };
};

export default useConfirm;