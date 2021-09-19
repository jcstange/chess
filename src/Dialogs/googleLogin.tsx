import { Dialog } from "@material-ui/core"
import React, { useState } from "react"
import {} from "react-google-login"
import {
    GoogleLoginResponse,
    GoogleLoginResponseOffline,
    GoogleLogin,
} from "react-google-login"
import "@fontsource/roboto"

type GoogleLoginDialogProps = {
    open: boolean
}

const clientId: string =
    "112563683285-efdr916pqe96h18575e3q9kpst3iugs0.apps.googleusercontent.com"

export const GoogleLoginDialog: React.FC<GoogleLoginDialogProps> = ({
    open,
}) => {
    const [_open, setOpen] = useState<boolean>(open)
    const onSuccess = (
        response: GoogleLoginResponse | GoogleLoginResponseOffline,
    ) => {
        console.log(`Login successful ${response}`)
        setOpen(false)
    }
    const onFailure = (response: any) => {
        console.log(`Login failure ${response}`)
        setOpen(true)
    }

    const styles = {
        dialog: {
            display: "flex-inline",
            alignItems: "center" as "center",
            padding: 40,
        },
        text: {
            fontFamily: "Roboto",
            fontSize: 20,
            marginBottom: 20,
        },
    }

    return (
        <Dialog open={_open}>
            <div style={styles.dialog}>
                <div style={styles.text}>
                    To be able to play with your friend/enemy you have login
                    with your Google Account
                </div>
                <GoogleLogin
                    style={{ width: "100%" }}
                    clientId={clientId}
                    buttonText="Sign in with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    isSignedIn={false}
                />
            </div>
        </Dialog>
    )
}
