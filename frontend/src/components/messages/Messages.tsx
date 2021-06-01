/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef, useEffect } from "react";
import { useVirtual } from "react-virtual";
import {
    mdiTrashCanOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import {
    Card,
    CardHeader,
    CardContent,
    Subtitle2,
    Body2,
    IconButton,
} from "ui-neumorphism";
import "ui-neumorphism/dist/index.css";
import { Message } from "../../generated/graphql";
import "./Messages.css"

export default function Messages({ email, rows, onDeleteMessage }: {
    email: string,
    rows: Message[],
    onDeleteMessage: (msgId: string) => void,
}) {
    const parentRef = useRef(null);

    const rowVirtualizer = useVirtual({
        size: rows.length,
        parentRef,
    });

    useEffect(() => {
        rowVirtualizer.scrollToIndex(rows.length - 1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows])

    return (
        <div
            ref={parentRef}
            className="List"
            css={css`
                height: 600px;
                overflow: auto;
            `}
        >
            <div
                css={css`
                    height: ${rowVirtualizer.totalSize}px;
                    width: 100%;
                    position: relative;
                `}
            >
                {rowVirtualizer.virtualItems.map((virtualRow) => {
                    const { id: msgId, user, content } = rows[virtualRow.index];
                    const isMe = user.id === email;

                    return (<div
                        key={virtualRow.index}
                        ref={virtualRow.measureRef}
                        className={isMe ? "message-me" : "message-others"}
                        css={css`
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            transform: translateY(${virtualRow.start}px);
                        `}
                    >
                        <Card className="message">
                            <CardHeader
                                className="message-header"
                                subtitle={<Subtitle2 secondary>
                                    {`${user.name} - ${user.id}`}
                                </Subtitle2>}
                                action={
                                    <IconButton
                                        size='small'
                                        onClick={() => onDeleteMessage(msgId)}
                                    >
                                        <Icon path={mdiTrashCanOutline} size={0.6}></Icon>
                                    </IconButton>
                                }
                            />
                            <CardContent className="message-content">
                                <Body2>{content}</Body2>
                            </CardContent>
                        </Card>
                    </div>)
                })}
            </div>
        </div>
    )
}
