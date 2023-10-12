import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { FlexBox } from '@/components/FlexBox/FlexBox'
import { Information } from '@/components/Information'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { DetailsContent } from '@/components/_nft/NftTile'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMountEffect } from '@/hooks/useMountEffect'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useJoystream, useSubscribeAccountBalance } from '@/providers/joystream'

import { CommonProps } from './types'

export const getTokenDetails = (_: string) => ({
  title: 'JBC',
  pricePerUnit: 1000,
  tokensOnSale: 67773,
  userBalance: 100000,
})

type BuySaleTokenFormProps = {
  tokenId: string
  onSubmit: (tokens: number | null) => void
} & CommonProps

export const BuySaleTokenForm = ({ tokenId, setPrimaryButtonProps, onSubmit }: BuySaleTokenFormProps) => {
  const { control, watch, handleSubmit } = useForm<{ tokens: number | null }>()
  const { accountBalance } = useSubscribeAccountBalance()
  const tokens = watch('tokens')
  const { pricePerUnit, tokensOnSale, userBalance, title } = getTokenDetails(tokenId)
  const { tokenPrice } = useJoystream()
  const tokenInUsd = (tokens || 0) * pricePerUnit * (tokenPrice ?? 0)

  const smMatch = useMediaMatch('sm')

  const details = useMemo(
    () => [
      {
        title: 'You will get',
        content: (
          <NumberFormat
            value={tokens || 0}
            as="p"
            format={(tokens || 0) > 1_000_000 ? 'short' : 'full'}
            variant="t200"
            withDenomination="before"
            withToken
            customTicker={`$${title}`}
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'Fee',
        content: <NumberFormat value={tokensOnSale} as="p" variant="t200" withDenomination="before" withToken />,
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'You will spend',
        content: <NumberFormat value={tokensOnSale} as="p" variant="t200" withDenomination="before" withToken />,
        tooltipText: 'Lorem ipsum',
      },
    ],
    [title, tokens, tokensOnSale]
  )

  useMountEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: () => handleSubmit((data) => onSubmit(data.tokens))(),
    })
  })

  return (
    <>
      <FlexBox flow="column" gap={8}>
        <FlexBox gap={6} equalChildren>
          <DetailsContent
            avoidIconStyling
            tileSize={smMatch ? 'big' : 'bigSmall'}
            caption="PRICE PER UNIT"
            content={pricePerUnit}
            icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
            tooltipText="Lorem ipsum"
            withDenomination
          />
          <DetailsContent
            avoidIconStyling
            tileSize={smMatch ? 'big' : 'bigSmall'}
            caption={`YOUR ${atlasConfig.joystream.tokenTicker} BALANCE`}
            content={userBalance}
            icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
            tooltipText="Lorem ipsum"
            withDenomination
          />
        </FlexBox>
        <Controller
          name="tokens"
          control={control}
          rules={{
            max: {
              value: accountBalance ? hapiBnToTokenNumber(accountBalance) : 0,
              message: 'Amount exceeds your account balance',
            },
            required: true,
          }}
          render={({ field }) => (
            <FormField label="Tokens to spend">
              <TokenInput
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
                nodeEnd={
                  <FlexBox gap={2} alignItems="baseline">
                    <Text variant="t300" as="p" color="colorTextMuted">
                      ${tokenInUsd.toFixed(2)}
                    </Text>
                    <TextButton
                      onClick={() =>
                        accountBalance && field.onChange(Math.floor(hapiBnToTokenNumber(accountBalance) / pricePerUnit))
                      }
                    >
                      Max
                    </TextButton>
                  </FlexBox>
                }
              />
            </FormField>
          )}
        />

        <FlexBox flow="column" gap={2}>
          {details.map((row, i) => (
            <FlexBox key={row.title} alignItems="center" justifyContent="space-between">
              <FlexBox width="fit-content" alignItems="center">
                <Text variant={i + 1 === details.length ? 't200-strong' : 't200'} as="p" color="colorText">
                  {row.title}
                </Text>
                <Information text={row.tooltipText} />
              </FlexBox>
              {row.content}
            </FlexBox>
          ))}
        </FlexBox>
      </FlexBox>
    </>
  )
}