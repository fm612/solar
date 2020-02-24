import React from "react"
import List from "@material-ui/core/List"
import { useIsMobile } from "../../hooks/userinterface"
import PasswordSetting from "./PasswordSetting"
import SecretKeyImport from "./SecretKeyImport"
import { AccountCreation, AccountCreationErrors } from "./types"

interface AccountCreationSettingsProps {
  accountCreation: AccountCreation
  errors: AccountCreationErrors
  onUpdateAccountCreation: (update: Partial<AccountCreation>) => void
}

function AccountCreationSettings(props: AccountCreationSettingsProps) {
  const isSmallScreen = useIsMobile()

  const togglePasswordProtection = React.useCallback(() => {
    props.onUpdateAccountCreation({ requiresPassword: !props.accountCreation.requiresPassword })
  }, [props.accountCreation.requiresPassword, props.onUpdateAccountCreation])

  const updatePassword = React.useCallback(
    (password: string) => {
      props.onUpdateAccountCreation({ password })
    },
    [props.onUpdateAccountCreation]
  )

  const updateRepeatedPassword = React.useCallback(
    (repeatedPassword: string) => {
      props.onUpdateAccountCreation({ repeatedPassword })
    },
    [props.onUpdateAccountCreation]
  )

  const updateSecretKey = React.useCallback(
    (secretKey: string) => {
      props.onUpdateAccountCreation({ secretKey })
    },
    [props.onUpdateAccountCreation]
  )

  return (
    <List style={{ padding: isSmallScreen ? 0 : "24px 16px" }}>
      {props.accountCreation.import ? (
        <SecretKeyImport onEnterSecretKey={updateSecretKey} secretKey={props.accountCreation.secretKey || ""} />
      ) : null}
      <PasswordSetting
        error={props.errors.password}
        password={props.accountCreation.password}
        onEnterPassword={updatePassword}
        onRepeatPassword={updateRepeatedPassword}
        onTogglePassword={togglePasswordProtection}
        repeatedPassword={props.accountCreation.repeatedPassword}
        requiresPassword={props.accountCreation.requiresPassword}
      />
    </List>
  )
}

export default React.memo(AccountCreationSettings)
