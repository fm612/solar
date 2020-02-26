import React from "react"
import RestoreIcon from "@material-ui/icons/SettingsBackupRestore"
import WalletIcon from "@material-ui/icons/AccountBalanceWallet"
import { Account } from "../../context/accounts"
import { useRouter } from "../../hooks/userinterface"
import { matchesRoute } from "../../lib/routes"
import * as routes from "../../routes"
import ExportKeyDialog from "../AccountSettings/ExportKeyDialog"
import MainSelectionButton from "../Form/MainSelectionButton"
import { VerticalLayout } from "../Layout/Box"
import Carousel from "../Layout/Carousel"
import NewAccountSettings from "./NewAccountSettings"
import { AccountCreation, AccountCreationErrors } from "./types"

interface InitialSelectionProps {
  onUpdateAccountCreation: (update: Partial<AccountCreation>) => void
  testnet: boolean
}

const InitialSelection = React.memo(
  React.forwardRef(function InitialSelection(props: InitialSelectionProps, ref: React.Ref<HTMLDivElement>) {
    const router = useRouter()

    const createAccount = React.useCallback(() => {
      props.onUpdateAccountCreation({ import: false })
      router.history.push(routes.createAccount(props.testnet))
    }, [props.onUpdateAccountCreation, props.testnet, router.history, routes.createAccount])

    const importAccount = React.useCallback(() => {
      props.onUpdateAccountCreation({ import: true })
      router.history.push(routes.importAccount(props.testnet))
    }, [props.onUpdateAccountCreation, props.testnet, router.history, routes.createAccount])

    return (
      <VerticalLayout ref={ref} alignItems="center" margin="48px 0 24px" padding="0 8px">
        <VerticalLayout alignItems="stretch" margin="0 auto">
          <MainSelectionButton
            dense
            label="Create account"
            description="Create a new empty account"
            gutterBottom
            onClick={createAccount}
            variant="primary"
            Icon={WalletIcon}
          />
          <MainSelectionButton
            dense
            label="Import account"
            description="Restore account from backup"
            gutterBottom
            onClick={importAccount}
            Icon={RestoreIcon}
          />
        </VerticalLayout>
      </VerticalLayout>
    )
  })
)

interface AccountCreationOptionsProps {
  accountToBackup: Account | null
  accountCreation: AccountCreation
  errors: AccountCreationErrors
  onFinishBackup: () => void
  onUpdateAccountCreation: (update: Partial<AccountCreation>) => void
}

function AccountCreationOptions(props: AccountCreationOptionsProps) {
  const router = useRouter()
  const testnet = Boolean(router.location.pathname.match(/\/testnet/))

  const currentStep = matchesRoute(router.location.pathname, routes.newAccount(testnet), false)
    ? 0
    : !props.accountToBackup
    ? 1
    : 2

  return (
    <Carousel current={currentStep}>
      <InitialSelection onUpdateAccountCreation={props.onUpdateAccountCreation} testnet={testnet} />
      <NewAccountSettings {...props} />
      <ExportKeyDialog account={props.accountToBackup} onConfirm={props.onFinishBackup} variant="initial-backup" />
    </Carousel>
  )
}

export default React.memo(AccountCreationOptions)
