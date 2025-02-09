import React from "react"
import { useTranslation } from "react-i18next"
import Dialog from "@material-ui/core/Dialog"
import List from "@material-ui/core/List"
import ListItemText from "@material-ui/core/ListItemText"
import EyeIcon from "@material-ui/icons/RemoveRedEye"
import DeleteIcon from "@material-ui/icons/Delete"
import GroupIcon from "@material-ui/icons/Group"
import KeyIcon from "@material-ui/icons/VpnKey"
import { Account } from "../../context/accounts"
import { SettingsContext } from "../../context/settings"
import { useLiveAccountData } from "../../hooks/stellar-subscriptions"
import { useIsMobile, useRouter } from "../../hooks/userinterface"
import { matchesRoute } from "../../lib/routes"
import * as routes from "../../routes"
import { FullscreenDialogTransition } from "../../theme"
import AccountDeletionDialog from "./AccountDeletionDialog"
import AccountSettingsItem from "./AccountSettingsItem"
import ChangePasswordDialog from "./ChangePasswordDialog"
import ExportKeyDialog from "./ExportKeyDialog"
import ManageSignersDialog from "../ManageSigners/ManageSignersDialog"

function SettingsDialogs(props: Props) {
  const router = useRouter()

  const showChangePassword = matchesRoute(router.location.pathname, routes.changeAccountPassword("*"))
  const showDeleteAccount = matchesRoute(router.location.pathname, routes.deleteAccount("*"))
  const showExportKey = matchesRoute(router.location.pathname, routes.exportSecretKey("*"))
  const showManageSigners = matchesRoute(router.location.pathname, routes.manageAccountSigners("*"))

  const navigateTo = React.useMemo(
    () => ({
      accountSettings: () => router.history.push(routes.accountSettings(props.account.id)),
      allAccounts: () => router.history.push(routes.allAccounts())
    }),
    [router.history, props.account]
  )

  return (
    <>
      <Dialog
        fullScreen
        open={showChangePassword}
        onClose={navigateTo.accountSettings}
        TransitionComponent={FullscreenDialogTransition}
      >
        <ChangePasswordDialog account={props.account} onClose={navigateTo.accountSettings} />
      </Dialog>
      <Dialog
        fullScreen
        open={showDeleteAccount}
        onClose={navigateTo.accountSettings}
        TransitionComponent={FullscreenDialogTransition}
      >
        <AccountDeletionDialog
          account={props.account}
          onClose={navigateTo.accountSettings}
          onDeleted={navigateTo.allAccounts}
        />
      </Dialog>
      <Dialog
        fullScreen
        open={showExportKey}
        onClose={navigateTo.accountSettings}
        TransitionComponent={FullscreenDialogTransition}
      >
        <ExportKeyDialog account={props.account} onClose={navigateTo.accountSettings} variant="export" />
      </Dialog>
      <Dialog
        fullScreen
        open={showManageSigners}
        onClose={navigateTo.accountSettings}
        TransitionComponent={FullscreenDialogTransition}
      >
        <ManageSignersDialog account={props.account} onClose={navigateTo.accountSettings} />
      </Dialog>
    </>
  )
}

interface Props {
  account: Account
}

function AccountSettings(props: Props) {
  const accountData = useLiveAccountData(props.account.publicKey, props.account.testnet)
  const isSmallScreen = useIsMobile()
  const router = useRouter()
  const { t } = useTranslation()
  const settings = React.useContext(SettingsContext)

  const navigateTo = React.useMemo(
    () => ({
      changePassword: () => router.history.push(routes.changeAccountPassword(props.account.id)),
      deleteAccount: () => router.history.push(routes.deleteAccount(props.account.id)),
      exportSecretKey: () => router.history.push(routes.exportSecretKey(props.account.id)),
      manageSigners: () => router.history.push(routes.manageAccountSigners(props.account.id))
    }),
    [router.history, props.account]
  )

  const listItemTextStyle: React.CSSProperties = React.useMemo(
    () => ({
      paddingRight: isSmallScreen ? 0 : undefined
    }),
    [isSmallScreen]
  )

  return (
    <>
      <List style={{ padding: isSmallScreen ? 0 : "24px 16px" }}>
        <AccountSettingsItem icon={<KeyIcon style={{ fontSize: "100%" }} />} onClick={navigateTo.changePassword}>
          <ListItemText
            primary={
              props.account.requiresPassword
                ? t("account-settings.set-password.text.primary.account-protected")
                : t("account-settings.set-password.text.primary.account-not-protected")
            }
            secondary={
              props.account.requiresPassword
                ? t("account-settings.set-password.text.secondary.account-protected")
                : t("account-settings.set-password.text.secondary.account-not-protected")
            }
            style={listItemTextStyle}
          />
        </AccountSettingsItem>
        {settings.multiSignature ? (
          <AccountSettingsItem
            disabled={accountData.balances.length === 0}
            icon={<GroupIcon style={{ fontSize: "100%" }} />}
            onClick={navigateTo.manageSigners}
          >
            <ListItemText
              primary={t("account-settings.multi-sig.text.primary")}
              secondary={
                isSmallScreen
                  ? t("account-settings.multi-sig.text.secondary.short")
                  : t("account-settings.multi-sig.text.secondary.long")
              }
              style={listItemTextStyle}
            />
          </AccountSettingsItem>
        ) : null}
        <AccountSettingsItem icon={<EyeIcon style={{ fontSize: "100%" }} />} onClick={navigateTo.exportSecretKey}>
          <ListItemText
            primary={t("account-settings.export-secret-key.text.primary")}
            secondary={t("account-settings.export-secret-key.text.secondary")}
            style={listItemTextStyle}
          />
        </AccountSettingsItem>
        <AccountSettingsItem icon={<DeleteIcon style={{ fontSize: "100%" }} />} onClick={navigateTo.deleteAccount}>
          <ListItemText primary={t("account-settings.delete-account.text.primary")} style={listItemTextStyle} />
        </AccountSettingsItem>
      </List>
      <SettingsDialogs account={props.account} />
    </>
  )
}

export default React.memo(AccountSettings)
