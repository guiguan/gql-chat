/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
    mdiEmailOutline,
    mdiAccountOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useHistory } from "react-router-dom";
import {
    Card,
    TextField,
    Button,
} from "ui-neumorphism";
import "ui-neumorphism/dist/index.css";
import ErrorAlert from '../error-alert/ErrorAllert';
import { useRegisterUserMutation } from "../../generated/graphql";
import "./Register.css"

export default function Register({
    email,
    setEmail,
    name,
    setName,
}: {
    email: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    name: string,
    setName: React.Dispatch<React.SetStateAction<string>>,
}) {
    const [registerUserMutation, { loading, error }] = useRegisterUserMutation();

    const history = useHistory();

    return (
        <Card
            loading={loading}
        >
            {error && <ErrorAlert>{error.message}</ErrorAlert>}
            <Card flat
                css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 30px;
                `}>
                <TextField
                    uncontrolled
                    label="Email"
                    value={email}
                    append={<Icon path={mdiEmailOutline} size={1} />}
                    onChange={({ value }: { value: string }) => setEmail(value)}
                />
                <TextField
                    uncontrolled
                    label="Name"
                    value={name}
                    append={<Icon path={mdiAccountOutline} size={1} />}
                    onChange={({ value }: { value: string }) => setName(value)}
                />
                <Button
                    onClick={async () => {
                        try {
                            await registerUserMutation({
                                variables: {
                                    user: {
                                        email,
                                        name,
                                    }
                                }
                            })

                            history.push("/chat?email=" + encodeURIComponent(email) + "&name=" + encodeURIComponent(name));
                        } catch (error) {
                            console.error(error);
                        }
                    }}
                >Login</Button>
            </Card>
        </Card >
    )
}
