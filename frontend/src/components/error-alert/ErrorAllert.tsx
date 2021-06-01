import {
    mdiAlert,
} from "@mdi/js";
import Icon from "@mdi/react";
import {
    Alert,
} from "ui-neumorphism";
import "ui-neumorphism/dist/index.css";

export default function ErrorAlert({ children }: { children: string }) {
    return (<Alert
        type='error'
        border='left'
        icon={<Icon path={mdiAlert} size={1} />}
    >{children}</Alert>)
}
