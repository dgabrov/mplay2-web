import {useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface DraggableListItemProps {
    id: string;
    description: string;

    checkedVerifier: boolean;
    changeTrigger : (event: any) => void;
}

export const DraggableListItem = (props: DraggableListItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <li className={'margin-bottom'} style={style} ref={setNodeRef} {...attributes} {...listeners} >
            <input type="checkbox" checked={props.checkedVerifier} onChange={props.changeTrigger}/>
            <span className={'margin-left'}>{props.description}</span>
        </li>
    )
}

