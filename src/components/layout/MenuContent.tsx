import React from "react";
import {
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip
} from "@mui/material";
import { Circle, ExpandLess, ExpandMore } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

import { getUserMenuList } from "@/server/services/permissionService";
import { MenuResponse } from "@/types/PermissionTypes";
import { icons } from "@/config/mainMenu";

interface MenuContentProps {
    open?: boolean;
    onToggle: () => void;
}

export default function MenuContent({
    open = true,
    onToggle
}: MenuContentProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const [menus, setMenus] = React.useState<MenuResponse[]>([]);
    const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});

    React.useEffect(() => {
        loadMenus();
    }, []);

    const loadMenus = async () => {
        try {
            const response = await getUserMenuList();

            setMenus(response?.data ?? []);
        } catch (error) {
            console.error("Load menus failed", error);
        }
    };

    const isActive = React.useCallback(
        (path?: string) => {
            if (!path) return false;

            return (
                location.pathname === path ||
                location.pathname.startsWith(path + "/")
            );
        },
        [location.pathname]
    );

    /*const hasActiveChild = React.useCallback(
        (item: MenuResponse): boolean => {
            if (!item.children?.length) return false;

            return item.children.some(
                x =>
                    isActive(x.path) ||
                    hasActiveChild(x)
            );
        },
        [location.pathname]
    );*/
    const hasActiveChild = (
        item: MenuResponse
    ): boolean => {

        if (!item.children?.length)
            return false;

        return item.children.some(x => {
            if (x.path) {
                return (
                    location.pathname === x.path ||
                    location.pathname.startsWith(
                        x.path + "/"
                    )
                );
            }

            return hasActiveChild(x);
        });
    };

    React.useEffect(() => {
        const state: Record<number, boolean> = {};

        const walk = (items: MenuResponse[]) => {
            items.forEach(item => {
                if (
                    item.id &&
                    hasActiveChild(item)
                ) {
                    state[item.id] = true;
                }

                if (item.children?.length) {
                    walk(item.children);
                }
            });
        };

        walk(menus);

        setExpanded(prev => ({
            ...prev,
            ...state
        }));
    }, [menus, location.pathname]);

    const toggleMenu = (
        id: number
    ) => {
        if (!open) {
            onToggle();
        }

        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const renderMenuItem = (
        item: MenuResponse,
        level = 0
    ): React.ReactNode => {

        const hasChildren = !!item.children?.length;

        const opened = expanded[item.id] ?? false;

        const selected = isActive(item.path) || hasActiveChild(item);

        const handleClickMenu = (item: MenuResponse) => {

            if (hasChildren) {
                toggleMenu(item.id);
                return;
            }
            if (item.path) {
                navigate(item.path);
            }
        }

        const content = (
            <ListItemButton
                selected={selected}
                onClick={() => handleClickMenu(item)}
                sx={{
                    minHeight: 48,
                    pl: 2 + level * 3,
                    pr: 2
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 30
                    }}
                >
                    {item.icon ? icons[item.icon] : <Circle sx={{ fontSize: '0.7rem' }} />}

                </ListItemIcon>

                {open && (
                    <>
                        <ListItemText
                            primary={item.name}
                        />

                        {hasChildren &&
                            (opened ? (
                                <ExpandLess />
                            ) : (
                                <ExpandMore />
                            ))}
                    </>
                )}
            </ListItemButton>
        );

        return (
            <React.Fragment key={item.id}>
                {!open && level === 0 ? (
                    <Tooltip
                        title={item.name}
                        placement="right"
                    >
                        {content}
                    </Tooltip>
                ) : (
                    content
                )}

                {hasChildren && open && (
                    <Collapse
                        in={opened}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List disablePadding>
                            {item.children!.map(
                                child => renderMenuItem(child, level + 1)
                            )}
                        </List>
                    </Collapse>
                )}
            </React.Fragment>
        );
    };

    return (
        <List disablePadding>
            {menus.map(item =>
                renderMenuItem(item)
            )}
        </List>
    );
}