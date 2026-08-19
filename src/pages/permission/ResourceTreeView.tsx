import { Resource } from "@/types/PermissionTypes";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RichTreeView, TreeViewBaseItem } from "@mui/x-tree-view";

interface IProps {
    resources: Resource[];
    setResources?: (data: string[]) => void;
}

export default function ResourceTreeView({
    resources,
    setResources,
}: IProps) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const prevSelectedRef = useRef<string[]>([]);

    // آیتم‌های انتخاب شده از سمت API
    const getSelectedIds = useCallback((items: Resource[]): string[] => {
        const result: string[] = [];

        items.forEach(controller => {

            const selectedChildren = controller.children
                .filter(c => c.hasAccess)
                .map(c => c.value);

            result.push(...selectedChildren);

            // اگر حداقل یک Child انتخاب شده بود
            if (selectedChildren.length > 0) {
                result.push(controller.value);
            }
        });

        return result;
    }, []);

    useEffect(() => {
        const ids = getSelectedIds(resources);
        setSelectedItems(ids);
        setResources?.(ids);
    }, [resources, getSelectedIds]);

    // ساخت Tree
    const treeData = useMemo<TreeViewBaseItem[]>(() => {
        return resources.map((controller) => ({
            id: controller.value,
            label: controller.controllerDisplayName || controller.label,
            children: controller.children.map((action) => ({
                id: action.value,
                label: action.name || action.label,
            })),
        }));
    }, [resources]);

    // ساخت Map برای دسترسی سریع
    const nodeMap = useMemo(() => {
        const map = new Map<string, TreeViewBaseItem>();

        const walk = (nodes: TreeViewBaseItem[]) => {
            nodes.forEach((node) => {
                map.set(node.id as string, node);

                if (node.children?.length) {
                    walk(node.children);
                }
            });
        };

        walk(treeData);

        return map;
    }, [treeData]);

    // گرفتن تمام فرزندان
    const getChildrenIds = useCallback((node: TreeViewBaseItem): string[] => {
        const result: string[] = [];

        const walk = (current: TreeViewBaseItem) => {
            current.children?.forEach((child) => {
                result.push(child.id as string);
                walk(child);
            });
        };

        walk(node);

        return result;
    }, []);

    useEffect(() => {
        prevSelectedRef.current = selectedItems;
    }, [selectedItems]);

    const handleSelectionChange = useCallback(
        (_: React.SyntheticEvent | null, itemIds: string[]) => {
            const previous = prevSelectedRef.current;

            const added = itemIds.filter((id) => !previous.includes(id));
            const removed = previous.filter((id) => !itemIds.includes(id));

            const selection = new Set(itemIds);

            // انتخاب Controller => انتخاب همه Action ها
            added.forEach((id) => {
                const node = nodeMap.get(id);

                if (!node) return;

                getChildrenIds(node).forEach((childId) => selection.add(childId));
            });

            // حذف Controller => حذف همه Action ها
            removed.forEach((id) => {
                const node = nodeMap.get(id);

                if (!node) return;

                getChildrenIds(node).forEach((childId) =>
                    selection.delete(childId)
                );
            });

            const selected = Array.from(selection);

            setSelectedItems(selected);
            setResources?.(selected);
        },
        [nodeMap, getChildrenIds, setResources]
    );

    return (
        <RichTreeView
            items={treeData}
            checkboxSelection
            multiSelect
            selectedItems={selectedItems}
            onSelectedItemsChange={handleSelectionChange}
        />
    );
}