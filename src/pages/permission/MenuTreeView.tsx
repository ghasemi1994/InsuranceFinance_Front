import { MenuResponse } from "@/types/PermissionTypes";
import { RichTreeView, TreeViewBaseItem } from "@mui/x-tree-view";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface IProps {
  menus: MenuResponse[];
  setMenus?: (data: number[]) => void;
}

export default function MenuTreeView({ menus, setMenus }: IProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const prevSelectedRef = useRef<string[]>([]);

  // استخراج آیتم‌های انتخاب‌شده از API
  const getSelectedIds = useCallback((items: MenuResponse[]): string[] => {
    const result: string[] = [];

    const traverse = (nodes: MenuResponse[]) => {
      nodes.forEach((node) => {
        if (node.hasAccess) {
          result.push(node.id.toString());
        }

        if (node.children?.length) {
          traverse(node.children);
        }
      });
    };

    traverse(items);

    return result;
  }, []);

  useEffect(() => {
    const ids = getSelectedIds(menus);
    setSelectedItems(ids);
    setMenus?.(ids.map(Number));
  }, [menus, getSelectedIds]);

  // تبدیل منوها به ساختار TreeView
  const mapToTree = useCallback(
    (items: MenuResponse[]): TreeViewBaseItem[] =>
      items.map((item) => ({
        id: item.id.toString(),
        label: item.name,
        children: mapToTree(item.children ?? []),
      })),
    []
  );

  const treeData = useMemo(() => mapToTree(menus), [menus, mapToTree]);

  // Map برای جستجوی سریع
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

  // گرفتن همه فرزندان یک گره
  const getChildrenIds = useCallback(
    (node: TreeViewBaseItem): string[] => {
      const result: string[] = [];

      const walk = (current: TreeViewBaseItem) => {
        current.children?.forEach((child) => {
          result.push(child.id as string);
          walk(child);
        });
      };

      walk(node);

      return result;
    },
    []
  );

  useEffect(() => {
    prevSelectedRef.current = selectedItems;
  }, [selectedItems]);

  const handleSelectionChange = useCallback(
    (_: React.SyntheticEvent | null, itemIds: string[]) => {
      const previous = prevSelectedRef.current;

      const added = itemIds.filter((x) => !previous.includes(x));
      const removed = previous.filter((x) => !itemIds.includes(x));

      const selection = new Set(itemIds);

      // انتخاب Parent => انتخاب همه فرزندان
      added.forEach((id) => {
        const node = nodeMap.get(id);

        if (!node) return;

        getChildrenIds(node).forEach((childId) => selection.add(childId));
      });

      // حذف Parent => حذف همه فرزندان
      removed.forEach((id) => {
        const node = nodeMap.get(id);

        if (!node) return;

        getChildrenIds(node).forEach((childId) => selection.delete(childId));
      });

      const selected = Array.from(selection);

      setSelectedItems(selected);

      setMenus?.(selected.map(Number));
    },
    [nodeMap, getChildrenIds, setMenus]
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