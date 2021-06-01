/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Card,
  TextArea,
  Button,
} from "ui-neumorphism";
import "ui-neumorphism/dist/index.css";
import useSize from '@react-hook/size';
import Messages from '../messages/Messages';
import ErrorAlert from '../error-alert/ErrorAllert';
import {
  useSubscribeMessagesSubscription,
  useSendMessageMutation,
  useDeleteMessageMutation,
  Message,
} from "../../generated/graphql";
import "./Chat.css";

export default function Chat({
  email,
}: {
  email: string,
}) {
  const textareaParent = useRef(null);
  const [width] = useSize(textareaParent)

  const [rows, setRows] = useState<Message[]>([])

  const { loading: subLoading, error: subError, data } = useSubscribeMessagesSubscription({
    variables: {
      userId: email,
    },
  })

  const [sendMessageMutation, { loading: sendMsgLoading, error: sendMsgError }] = useSendMessageMutation()

  useEffect(() => {
    if (!subLoading && data) {
      setRows([...rows, data.message])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subLoading, data])

  const [msg, setMsg] = useState("")

  const sendMsg = useCallback(async () => {
    try {
      await sendMessageMutation({
        variables: {
          userId: email,
          msg: {
            content: msg
          }
        }
      })

      setMsg("");
    } catch (error) {
      console.log(error)
    }
  }, [email, msg, sendMessageMutation])

  const [deleteMessageMutation, { error: deleteMsgError }] = useDeleteMessageMutation();

  const deleteMsg = useCallback(async (msgId: string) => {
    try {
      await deleteMessageMutation({
        variables: {
          userId: email,
          msgId,
        }
      })

      setRows(rows.filter(v => v.id !== msgId))
    } catch (error) {
      console.error(error)
    }
  }, [rows, email, deleteMessageMutation])

  const error = subError || sendMsgError || deleteMsgError

  return (
    <Card
      loading={subLoading}
      css={css`
          overflow: hidden;
        `}
    >
      {error && <ErrorAlert>{error.message}</ErrorAlert>}
      <Card flat>
        <Messages
          email={email}
          rows={rows}
          onDeleteMessage={deleteMsg}
        />
      </Card>
      <Card flat>
        <div ref={textareaParent}>
          <TextArea
            uncontrolled
            loading={sendMsgLoading}
            height={80}
            width={width - 110}
            value={msg}
            onChange={({ value }: { value: string }) => setMsg(value)}
            append={
              <Button
                onClick={sendMsg}
              >
                Send
              </Button>
            } />
        </div>
      </Card>
    </Card>
  );
}
