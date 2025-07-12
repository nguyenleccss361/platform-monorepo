import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { toast } from 'sonner'
import useLocalStorageState from 'use-local-storage-state'

import storage from '@/utils/storage'
import { useNavigate } from '@tanstack/react-router'

export const useWS = <T>(url: string, sendMessageCallback: () => void) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [projectId] = useLocalStorageState<string>('iot_platform_projectId') as unknown as string

  useEffect(() => {
    sendMessageCallback()
  }, [])

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
  } = useWebSocket<T>(url, {
    onError: () => {
      toast.error(t('ws:connect_error'))
    },
    onClose: () => {
      if (window.location.pathname.split('/')[4] != null) {
        sendMessageCallback()
      }
    },
    shouldReconnect: closeEvent => true,
    reconnectAttempts: 5,
    // attemptNumber will be 0 the first time it attempts to reconnect, so this equation results in a reconnect pattern of 1 second, 2 seconds, 4 seconds, 8 seconds, and then caps at 10 seconds until the maximum number of attempts is reached
    reconnectInterval: attemptNumber =>
      Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    onReconnectStop: () => {
      if (storage.getIsPersistLogin()) {
        // navigate({to: `${PATHS.DASHBOARD}/${projectId}`})
      }
    },
    heartbeat: {
      message: JSON.stringify({ ping: 'ping' }),
      returnMessage: JSON.stringify({ pong: 'ok' }), // If a returnMessage is defined, it will be ignored so that it won't be set as the lastJsonMessage
      timeout: 60 * 1000, // 1 minute, if no response is received, the connection will be closed
      interval: 25 * 1000, // every 25 seconds, a ping message will be sent
    },
  })

  type ConnectionStatus =
    | 'Connecting'
    | 'Open'
    | 'Closing'
    | 'Closed'
    | 'Uninstantiated'
  const status: { [key: number]: ConnectionStatus } = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }
  const connectionStatus: ConnectionStatus = status[readyState]

  return [
    { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage, readyState },
    connectionStatus,
  ] as const
}
