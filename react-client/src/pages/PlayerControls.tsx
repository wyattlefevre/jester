import {
  Alert,
  AppBar,
  Button,
  Container,
  OutlinedInput,
  Snackbar,
  Toolbar,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { Prompt, PromptResponse, PromptType } from '../services/Prompt'
import { ClientEvents } from '../services/SocketEvents'

const PlayerControls = () => {
  const { roomId } = useParams()
  const colors = ['#5000a6', '#a60000', '#a69200', '#3da600', '#00a64d', '#0053a6', '#9e00a6']
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [message, setMessage] = useState<string | null>('message example')
  const [bgColor, setBgColor] = useState<string>('#5000a6')
  const [nickname, setNickname] = useState<string>('')
  const [customResponse, setCustomResponse] = useState<string>('')
  const [playerSocket, setPlayerSocket] = useState<Socket | null>()
  const [displayError, setDisplayError] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  // TODO: keep track of number of responses. shoould there be an acknowledge? could wait for acknowledge before allowing another submit.
  // acknowledge could also send back the number of responses left. when it's zero, you could clear the screen and set to waiting until the next prompt is set
  const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
  }
  useEffect(() => {
    setBgColor(randomColor())
    const localNickName = localStorage.getItem('nickname')
    setNickname(localNickName || 'ERROR retrieving nickname')
    if (!roomId || !localNickName || !process.env.REACT_APP_API_SOCKET_URL) {
      return
    }
    const socket = io(process.env.REACT_APP_API_SOCKET_URL)
    socket.on(ClientEvents.Connect, () => {
      socket.emit('join-room', roomId, localNickName)
    })

    socket.on(ClientEvents.Prompt, (prompt: Prompt) => {
      console.log('received prompt', prompt)
      console.log('prompt', prompt)
      setPrompt(prompt)
    })
    socket.on(ClientEvents.Message, (msg) => {
      setMessage(msg)
    })
    socket.on(ClientEvents.Error, (msg) => {
      setError(msg)
      setDisplayError(true)
    })
    socket.on(ClientEvents.ClosePrompt, () => {
      setPrompt(null)
    })

    setPlayerSocket(socket)
    console.log('play game as', localNickName)
  }, [])

  const onSubmitCustomResponse = () => {
    if (!prompt || !prompt.promptId || customResponse === '') {
      return
    }
    const promptResponse: PromptResponse = {
      promptId: prompt.promptId,
      response: customResponse,
    }
    playerSocket?.emit(ClientEvents.PromptResponse, promptResponse)
    setCustomResponse('')
  }

  const onSubmitResponse = (responseText: string) => {
    if (!prompt || !prompt.promptId || !responseText) {
      console.log('nothing to submit')
      console.log(prompt, responseText)
      return
    }
    const promptResponse: PromptResponse = {
      promptId: prompt.promptId,
      response: responseText,
    }
    playerSocket?.emit(ClientEvents.PromptResponse, promptResponse)
  }

  const renderResponseOptions = () => {
    if (prompt && prompt.rules.type === PromptType.Selection) {
      const buttonColor = randomColor()
      return (
        <>
          {prompt.rules.responseOptions &&
            prompt.rules.responseOptions.map((option, index) => {
              return (
                <Button
                  key={index}
                  variant="contained"
                  color="primary"
                  sx={{ mx: 1, backgroundColor: buttonColor }}
                  onClick={() => {
                    onSubmitResponse(option)
                  }}
                >
                  {option}
                </Button>
              )
            })}
        </>
      )
    } else {
      return (
        <div>
          <OutlinedInput
            value={customResponse}
            onChange={(e) => {
              setCustomResponse(e.target.value.toUpperCase())
            }}
            fullWidth={true}
            inputProps={{ style: { textAlign: 'center', fontSize: '1.3rem' } }}
          />
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            fullWidth={true}
            color="secondary"
            onClick={onSubmitCustomResponse}
          >
            Submit
          </Button>
        </div>
      )
    }
  }

  const renderPrompt = () => {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <Typography variant="h5" textAlign="center">
            {prompt?.prompt.toLowerCase()}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          {renderResponseOptions()}
        </Box>
      </>
    )
  }

  const handleCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setDisplayError(false)
  }

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: bgColor }}>
        <Toolbar>
          <Typography>{nickname}</Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#292929',
          color: 'white',
        }}
      >
        <Typography>Room {roomId}</Typography>
      </Box>
      <Container>{prompt && renderPrompt()}</Container>
      <Snackbar open={displayError} autoHideDuration={4000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default PlayerControls
