import { useState, useEffect } from "react";

export type WindowDimension = {
    width: number,
    height: number
}

var max = 1000

function getWindowDimensions() : WindowDimension {
    const { innerWidth: width, innerHeight: height } = window
    return { width, height }
}

function isMaxWidth(windowDimensions: WindowDimension) : boolean {
    const { width } = windowDimensions
    return width > max
}

export default function useIsMax() {
    const [ isMobile, setIsMobile ] = useState<boolean>(isMaxWidth(getWindowDimensions()))
    
    useEffect(() => {
        function handleResize(){
            const _windowDimensions = getWindowDimensions()
            const _isMobile = isMaxWidth(_windowDimensions)
            setIsMobile(_isMobile)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return isMobile
}