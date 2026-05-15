// События, которые сервер отправляет клиенту
export enum ServerEvent {
  ROOM_STATE = 'room_state',
  NEW_BET = 'new_bet',
  ROUND_START = 'round_start',
  ROUND_END = 'round_end',
  NEW_MESSAGE = 'new_message',
  BALANCE_UPDATE = 'balance_update',
  USER_WON = 'user_won',
}

// События, которые клиент отправляет серверу
export enum ClientEvent {
  PLACE_BET = 'place_bet',
  SEND_MESSAGE = 'send_message',
}
