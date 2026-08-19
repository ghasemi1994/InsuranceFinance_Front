import { MenuResponse } from "@/types/PermissionTypes";

export interface MenuIndex {
    pathMap: Map<string, MenuResponse>;
    idMap: Map<number, MenuResponse>;
}

export function buildMenuIndex(menu: MenuResponse[]): MenuIndex {
    const pathMap = new Map<string, MenuResponse>();
    const idMap = new Map<number, MenuResponse>();

    const walk = (
        items: MenuResponse[],
        parentId: number | null = null
    ) => {
        items.forEach(item => {
            const node = { ...item, parentId };

            idMap.set(node.id, node);

            if (node.path)
                pathMap.set(node.path, node);

            if (node.children)
                walk(node.children, node.id);
        });
    };

    walk(menu);

    return { pathMap, idMap };
}


export function resolveBreadcrumb(
    pathname: string,
    pathMap: Map<string, MenuResponse>,
    idMap: Map<number, MenuResponse>
) {
    let target = pathMap.get(pathname);

    if (!target) {
        // Use Array.from instead of spread operator
        const sorted = Array.from(pathMap.keys()).sort((a, b) => b.length - a.length);

        for (const p of sorted) {
            if (pathname.startsWith(p) && p !== "/") {
                target = pathMap.get(p);
                break;
            }
        }
    }

    if (!target) return [];

    const result: MenuResponse[] = [];

    let current: MenuResponse | undefined = target;

    while (current) {
        result.unshift(current);
        current = current.parentId
            ? idMap.get(current.parentId)
            : undefined;
    }

    return result;
}