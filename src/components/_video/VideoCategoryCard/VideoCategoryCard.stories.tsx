import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { VideoCategoryCard, VideoCategoryCardProps } from './VideoCategoryCard'

import { FeaturedVideoCategoryCard } from '.'

export default {
  title: 'Shared/V/VideoCategoryCard',
  argTypes: {
    color: { defaultValue: '#D92E61' },
    variant: { defaultValue: 'default' },
    categoryId: { defaultValue: '1' },
    videosTotalCount: { defaultValue: 300 },
  },
  component: VideoCategoryCard,
} as Meta

const Template: Story<VideoCategoryCardProps> = (args) => {
  return (
    <Container>
      <VideoCategoryCard {...args}>VideoCategoryCard</VideoCategoryCard>
    </Container>
  )
}
export const Default = Template.bind({})
Default.args = {}

const TemplateFeatured: Story<VideoCategoryCardProps> = (args) => {
  return (
    <Container2>
      <FeaturedVideoCategoryCard
        videoUrl="https://sumer-dev-2.joystream.app/storage/asset/v0/5Fbef6KfEP3ncHxroVsdWQF6gLb8ph47dcAmzWptjuMMWHnP"
        videoTitle="Anderson .Paak and The Free Nationals"
        {...args}
      >
        VideoCategoryCard
      </FeaturedVideoCategoryCard>
    </Container2>
  )
}
export const Featured = TemplateFeatured.bind({})
Featured.args = {}

const Container = styled.div`
  width: 414px;
`

const Container2 = styled.div`
  width: 636px;
`