import React from "react"
import RestoreIcon from "@material-ui/icons/SettingsBackupRestore"
import WalletIcon from "@material-ui/icons/AccountBalanceWallet"
import { useRouter } from "../../hooks/userinterface"
import { matchesRoute } from "../../lib/routes"
import * as routes from "../../routes"
import MainSelectionButton from "../Form/MainSelectionButton"
import { VerticalLayout } from "../Layout/Box"
import Carousel from "../Layout/Carousel"
import AccountCreationOptions from "./AccountCreationSettings"
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

interface NewAccountSetupProps {
  accountCreation: AccountCreation
  errors: AccountCreationErrors
  onUpdateAccountCreation: (update: Partial<AccountCreation>) => void
}

function NewAccountSetup(props: NewAccountSetupProps) {
  const router = useRouter()
  const testnet = Boolean(router.location.pathname.match(/\/testnet/))

  const isSelectionStep = matchesRoute(router.location.pathname, routes.newAccount(testnet), false)

  return (
    <Carousel current={isSelectionStep ? 0 : 1}>
      <InitialSelection onUpdateAccountCreation={props.onUpdateAccountCreation} testnet={testnet} />
      <AccountCreationOptions {...props} />
    </Carousel>
  )
}

export default React.memo(NewAccountSetup)
