import { Box, Typography } from '@mui/material'
import React from 'react'
import HostMessage, { HostMessageSizes } from '../services/HostMessage'

const HostMessages = ({ messages }: { messages: HostMessage[] }) => {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'top' }}
    >
      {messages.map((hostMessage, index) => {
        switch (hostMessage.size) {
          case HostMessageSizes.large:
            return (
              <Typography key={index} variant="h3">
                {hostMessage.text}
              </Typography>
            )
          case HostMessageSizes.medium:
            return (
              <Typography key={index} variant="h4">
                {hostMessage.text}
              </Typography>
            )
          case HostMessageSizes.small:
            return (
              <Typography key={index} variant="h6">
                {hostMessage.text}
              </Typography>
            )
          default:
            return <Typography></Typography>
        }
      })}
    </Box>
  )
}

export default HostMessages
