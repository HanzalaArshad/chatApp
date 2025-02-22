import { SkeletonCircle } from '@/components/ui/skeleton'
import { HStack, Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  return (
    <HStack gap="5">
      <Stack flex="1">
        <Skeleton height="45px" />
        <Skeleton height="45px"  />
        <Skeleton height="45px"  />
        <Skeleton height="45px"  />

      </Stack>
    </HStack>
  )
}

export default ChatLoading
