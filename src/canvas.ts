import { BrushMode, Direction } from './types';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants';
import { directions } from './utils/directions';

export class Canvas {
    private x: number;
    private y: number;
    private brushMode: BrushMode;
    private direction: Direction;
    private canvas: string[][];

    private createCanvas(): void {
        this.canvas = [...Array(CANVAS_HEIGHT).keys()]
            .map(() => [...Array(CANVAS_WIDTH).keys()].map(() => ' '));
    }

    constructor() {
        this.x = 15;
        this.y = 15;
        this.brushMode = BrushMode.DRAW;
        this.direction = Direction.TOP;
        this.createCanvas();
    }
    
    coord(): string {
        return `(${this.x},${this.y})\r\n`;
    }
    
    right(n = 1): void {
        n = +n;
        if (!n) {
            return;
        } 
        const directionIndex = directions.indexOf(this.direction);
        const newDirectionIndex = (directionIndex + n) % 8;
        this.direction = directions[newDirectionIndex];
    }

    left(n = 1): void {
        n = +n;
        if (!n) {
            return;
        }
        const reversedDirections = [...directions].reverse();
        const directionIndex = reversedDirections.indexOf(this.direction);
        const newDirectionIndex = (directionIndex + n) % 8;
        this.direction = reversedDirections[newDirectionIndex];
    }

    hover(): void {
        this.brushMode = BrushMode.HOVER;
    }

    draw(): void {
        this.brushMode = BrushMode.DRAW;
    }

    eraser(): void {
        this.brushMode = BrushMode.ERASER;
    }

    clear(): void {
        this.createCanvas();
    }

    render() {
        let res = '╔══════════════════════════════╗\r\n';
        this.canvas.forEach((row) => {
            res += `║${row.join('')}║\r\n`;
        });
        return `${res}╚══════════════════════════════╝\r\n\r\n`;
    }

    private handleStep(i, j) {
        if (this.brushMode === BrushMode.DRAW) {
            this.canvas[i][j] = '*';
        } else if (this.brushMode === BrushMode.ERASER) {
            this.canvas[i][j] = ' ';
        }
    }

    steps(n) {
        n = +n;
        if (!n) {
            return;
        }
        if (this.direction === Direction.TOP) {
            let i, j = this.x;
            for (i = this.y; i > this.y - n && i >= 0; i--) {
                this.handleStep(i,j);
            } 
            this.y = Math.max(i, 0);
        } else if (this.direction === Direction.BOTTOM) {
            let i, j = this.x;
            for (i = this.y; i < this.y + n && i < CANVAS_HEIGHT; i++) {
                this.handleStep(i,j);
            }
            this.y = Math.min(i, CANVAS_HEIGHT - 1); 
        } else if (this.direction === Direction.RIGHT) {
            let i = this.y, j;
            for (j = this.x; j < this.x + n && j < CANVAS_WIDTH; j++) {
                this.handleStep(i,j);
            }
            this.x = Math.min(j, CANVAS_WIDTH - 1); 
        } else if (this.direction === Direction.LEFT) {
            let i = this.y, j;
            for (j = this.x; j > this.x - n && j >= 0; j--) {
                this.handleStep(i,j);
            }
            this.x = Math.max(j, 0); 
        } else if (this.direction === Direction.TOP_RIGHT) {
            let i, j;
            for (i  = this.y, j = this.x; i > this.y - n && i >= 0 && j < this.x + n && j < CANVAS_WIDTH; i--, j++) {
                this.handleStep(i,j);
            }
            this.x = Math.min(j, CANVAS_WIDTH - 1);
            this.y = Math.max(i, 0);
        } else if (this.direction === Direction.TOP_LEFT) {
            let i, j;
            for (i  = this.y, j = this.x; i > this.y - n && i >= 0 && j > this.x - n && j >= 0; i--, j--) {
                this.handleStep(i,j);
            }
            this.x = Math.max(j, 0); 
            this.y = Math.max(i, 0);
        } else if (this.direction === Direction.BOTTOM_RIGHT) {
            let i, j;
            for (i  = this.y, j = this.x; i < this.y + n && i < CANVAS_HEIGHT && j < this.x + n && j < CANVAS_WIDTH; i++, j++) {
                this.handleStep(i,j);
            }
            this.y = Math.min(i, CANVAS_HEIGHT - 1); 
            this.x = Math.min(j, CANVAS_WIDTH - 1); 
        } else if (this.direction === Direction.BOTTOM_LEFT) {
            let i, j;
            for (i  = this.y, j = this.x; i < this.y + n && i < CANVAS_HEIGHT && j > this.x - n && j >= 0; i++, j--) {
                this.handleStep(i,j);
            }
            this.y = Math.min(i, CANVAS_HEIGHT - 1); 
            this.x = Math.max(j, 0); 
        }
    }
}