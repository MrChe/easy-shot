import React, {useState} from 'react';
import {Position, ResizableDelta, Rnd} from 'react-rnd';
import { remote } from 'electron';
import {ResizeDirection} from "re-resizable";
import {DraggableData, DraggableEvent} from "react-draggable";

// const { screen } = remote; // Main process modules


const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 2px #3a38d2',
    margin: '5px'
};

interface CropperProps {
    snip: (dimensions: CropperState) => void;
    destroySnipView: () => void;
}
interface CropperState {
    width: string | number
    height: string | number
    x: number
    y: number
}

export const Cropper = (props: CropperProps): JSX.Element => {
    // const { screen } = remote; // Main process modules
    const screenSize = remote?.screen?.getPrimaryDisplay().size;
    const [dimensions, setDimensions] = useState<any>({
        width: '500px',
        height: '500px',
        x: (screenSize?.width / 2) - 250,
        y: (screenSize?.height / 2) - 250
    });

    const onDragStop = ( e: DraggableEvent, data: DraggableData) => {
        setDimensions({x: data.x, y: data.y})
    };

    const onResize = (e: MouseEvent | TouchEvent, dir: ResizeDirection, elementRef: HTMLElement, delta: ResizableDelta, position: Position) => {
        setDimensions({
            width: elementRef.style.width,
            height: elementRef.style.height,
            x: position.x,
            y: position.y
        });
    }

    return (
        <div>
            <Rnd
                style={style}
                size={{ width: dimensions?.width, height: dimensions?.height }}
                position={{x: dimensions.x, y: dimensions.y}}
                onDragStop={onDragStop}
                onResize={onResize}
                bounds={'parent'}
            >
                <div className="rnd-controls">
                    <button
                        className="btn btn-primary"
                        onClick={() => props.snip(dimensions)}
                    >Capture
                    </button>
                    <button
                        onClick={props.destroySnipView}
                        className="btn btn-primary"
                    >Cancel
                    </button>
                </div>
            </Rnd>
        </div>
    )
}