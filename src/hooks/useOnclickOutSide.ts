import { useEffect, useRef } from 'react'


function useOnclickOutSide(handler: any) {
    const wrapperRef: any = useRef(null);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                handler();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    return wrapperRef;
}


export {
    useOnclickOutSide
}