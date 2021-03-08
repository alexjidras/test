import { Canvas } from '../canvas';

export const handleCommand = (command: string, canvas: Canvas) => {
    const [_command, arg] = command.split(' ');

    if (!/^coord|print|steps|right|left|render|clear|hover|draw|eraser$/.test(_command)) {
        return;
    }
    
    return canvas[_command](arg);
}