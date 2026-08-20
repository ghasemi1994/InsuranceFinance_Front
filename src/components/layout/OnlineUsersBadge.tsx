import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { Box, Typography } from "@mui/material";
import React from "react";

interface OnlineUsersBadgeProps {
    count: number;
}

type ChangeType = "increase" | "decrease" | null;

const OnlineUsersBadge = ({ count }: OnlineUsersBadgeProps) => {
    const previousCount = React.useRef(count);

    const [change, setChange] = React.useState<ChangeType>(null);
    const [difference, setDifference] = React.useState(0);

    React.useEffect(() => {
        const previous = previousCount.current;

        if (count !== previous) {
            const diff = count - previous;

            setDifference(Math.abs(diff));
            setChange(diff > 0 ? "increase" : "decrease");

            const timer = setTimeout(() => {
                setChange(null);
                setDifference(0);
            }, 1200);

            previousCount.current = count;

            return () => clearTimeout(timer);
        }

        previousCount.current = count;
    }, [count]);

    const isIncrease = change === "increase";
    const isDecrease = change === "decrease";

    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 2,

                bgcolor: "action.hover",

                transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",

                ...(isIncrease && {
                    bgcolor: "rgba(46, 125, 50, 0.08)",
                    boxShadow:
                        "0 0 0 1px rgba(46, 125, 50, 0.15)",
                }),

                ...(isDecrease && {
                    bgcolor: "rgba(211, 47, 47, 0.08)",
                    boxShadow:
                        "0 0 0 1px rgba(211, 47, 47, 0.15)",
                }),
            }}
        >
            {/* Online indicator */}
            <Box
                sx={{
                    position: "relative",
                    width: 8,
                    height: 8,
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        inset: -3,
                        borderRadius: "50%",
                        border: "1px solid",
                        borderColor: "success.main",
                        opacity: 0.35,

                        animation:
                            "onlinePulse 2s infinite",

                        "@keyframes onlinePulse": {
                            "0%": {
                                transform: "scale(0.8)",
                                opacity: 0.4,
                            },
                            "70%": {
                                transform: "scale(1.5)",
                                opacity: 0,
                            },
                            "100%": {
                                transform: "scale(1.5)",
                                opacity: 0,
                            },
                        },
                    }}
                />
            </Box>

            <PeopleAltOutlinedIcon
                sx={{
                    fontSize: 19,
                    color: "text.secondary",
                }}
            />

            {/* Count */}
            <Typography
                variant="body2"
                fontWeight={700}
                sx={{
                    minWidth: 28,
                    textAlign: "center",

                    transition:
                        "color 0.25s ease",

                    color: isIncrease
                        ? "success.main"
                        : isDecrease
                            ? "error.main"
                            : "text.primary",
                }}
            >
                {count.toLocaleString("fa-IR")}
            </Typography>

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    whiteSpace: "nowrap",
                }}
            >
                آنلاین
            </Typography>

            {/* Change indicator */}
            {change && (
                <Box
                    sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        minWidth: 26,
                        height: 20,

                        px: 0.5,

                        borderRadius: 10,

                        fontSize: 11,
                        fontWeight: 700,

                        animation:
                            "changeIndicator 1.2s ease forwards",

                        bgcolor: isIncrease
                            ? "success.main"
                            : "error.main",

                        color: "#fff",

                        "@keyframes changeIndicator": {
                            "0%": {
                                opacity: 0,
                                transform:
                                    "translateY(5px) scale(0.8)",
                            },
                            "20%": {
                                opacity: 1,
                                transform:
                                    "translateY(0) scale(1)",
                            },
                            "70%": {
                                opacity: 1,
                                transform:
                                    "translateY(-2px) scale(1)",
                            },
                            "100%": {
                                opacity: 0,
                                transform:
                                    "translateY(-8px) scale(0.9)",
                            },
                        },
                    }}
                >
                    {isIncrease ? "+" : "−"}
                    {difference}
                </Box>
            )}
        </Box>
    );
};

export default OnlineUsersBadge;