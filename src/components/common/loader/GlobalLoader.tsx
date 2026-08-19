import { appBarHeight } from "@/components/layout/constants";
import { Box, LinearProgress, Fade, useTheme } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";

export default function GlobalLoader({ open }: { open: boolean }) {
    const theme = useTheme();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!open) {
            setProgress(0);
            return;
        }

        const timer = setInterval(() => {
            setProgress((old) => {
                if (old >= 90) return old;
                return old + Math.random() * 10;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        setProgress(100);
    }, [open]);

    return (
        <Fade in={open}>
            <Box
                sx={{
                    position: "fixed",
                    top: appBarHeight,
                    left: 0,
                    width: "100%",
                    zIndex: 9999,
                }}
            >
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 3,
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? "rgba(255,255,255,.08)"
                                : "rgba(0,0,0,.05)",
                    }}
                />
            </Box>
        </Fade>
    );
}