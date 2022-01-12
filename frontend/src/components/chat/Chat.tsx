/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Card, TextArea, Button, Tooltip } from "ui-neumorphism";
import "ui-neumorphism/dist/index.css";
import useSize from "@react-hook/size";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import Messages from "../messages/Messages";
import ErrorAlert from "../error-alert/ErrorAllert";
import {
  useSubscribeMessagesSubscription,
  useSendMessageMutation,
  useDeleteMessageMutation,
  Message,
} from "../../generated/graphql";
import "./Chat.css";

const SEND_SHORTCUT = "Shift+Enter";

export default function Chat({ email }: { email: string }) {
  const textareaParent = useRef<HTMLDivElement>(null);
  const [width] = useSize(textareaParent);

  const [rows, setRows] = useState<Message[]>([]);

  const {
    loading: subLoading,
    error: subError,
    data,
  } = useSubscribeMessagesSubscription({
    variables: {
      userId: email,
    },
  });

  const [
    sendMessageMutation,
    { loading: sendMsgLoading, error: sendMsgError },
  ] = useSendMessageMutation();

  useEffect(() => {
    if (!subLoading && data) {
      setRows([...rows, data.message]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subLoading, data]);

  const [msg, setMsg] = useState("");
  const [uncontrolled, setUncontrolled] = useState(false);

  const sendMsg = useCallback(async () => {
    if (!msg) {
      return;
    }

    try {
      await sendMessageMutation({
        variables: {
          userId: email,
          msg: {
            content: msg,
          },
        },
      });

      setMsg("");
      // this textarea is buggy and needs to toggle this property in order to sync the value in
      setUncontrolled(true);
      setUncontrolled(false);
      // hack to regain focus
      textareaParent.current?.getElementsByTagName("textarea")[0].focus();
    } catch (error) {
      console.log(error);
    }
  }, [email, msg, sendMessageMutation]);

  const [deleteMessageMutation, { error: deleteMsgError }] =
    useDeleteMessageMutation();

  const deleteMsg = useCallback(
    async (msgId: string) => {
      try {
        await deleteMessageMutation({
          variables: {
            userId: email,
            msgId,
          },
        });

        setRows(rows.filter((v) => v.id !== msgId));
      } catch (error) {
        console.error(error);
      }
    },
    [rows, email, deleteMessageMutation]
  );

  const handleSendShortcut = useCallback(
    (e) => {
      e.preventDefault();
      sendMsg();
    },
    [sendMsg]
  );

  useHotkeys(SEND_SHORTCUT, handleSendShortcut);

  const error = subError || sendMsgError || deleteMsgError;

  return (
    <Card
      loading={subLoading}
      css={css`
        overflow: hidden;
      `}
    >
      {error && <ErrorAlert>{error.message}</ErrorAlert>}
      <Card flat>
        <Messages email={email} rows={rows} onDeleteMessage={deleteMsg} />
      </Card>
      <Card flat>
        <div ref={textareaParent}>
          <TextArea
            autofocus
            uncontrolled={uncontrolled}
            loading={sendMsgLoading}
            height={80}
            width={width - 110}
            value={msg}
            onChange={({ value }: { value: string }) => setMsg(value)}
            append={
              <Tooltip content={<div>{SEND_SHORTCUT}</div>}>
                <Button onClick={sendMsg}>Send</Button>
              </Tooltip>
            }
          />
        </div>
      </Card>
    </Card>
  );
}
