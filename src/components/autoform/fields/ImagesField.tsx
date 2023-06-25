import React, { useState } from 'react'
import _ from 'lodash'
import { Box, FileInput, Image, Layer, Stack } from 'grommet'
import { FormClose } from 'grommet-icons'
import { DragDropContext, Draggable, DraggableProvided, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { ReadOnlyBox, ReadOnlyTitle } from '../ViewComponents'
import AutoFormField from '../AutoFormField'

const ImageBox = styled(Box)`
  cursor: pointer;
`

const DeleteImageIconBox = styled(Box)`
  cursor: pointer;
`

const CloseLayerIconBox = styled(Box)`
  position: absolute;
  top: 15px;
  right: 20px;
  cursor: pointer;
`
const ImagesBox = styled(Box)<{ readOnly: boolean }>`
  flex-direction: row;
  padding: 10px;
`
// background-color: ${(props: any) => {
//   return 'initial'
//   // return props.readOnly ? 'initial' : '#f9f9f9'
// }};

const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function ImagesField({
  readOnlyMode,
  id,
  name,
  formState,
  required,
  help,
  validate,
  disabled,
  setFormState,
  width,
  errors,
}: {
  readOnlyMode: boolean
  id: string
  name: string
  formState: any
  required: boolean
  help: string
  validate: any
  disabled: boolean
  setFormState: any
  width: any
  errors: any
}) {
  const [imagePopoverDisplaySettings, setImagePopoverDisplaySettings] = useState({})
  const popoverLayers = _.map(formState[id] || [], (fileURL: any) => {
    return (
      <Layer
        margin="medium"
        responsive
        onEsc={() =>
          setImagePopoverDisplaySettings({
            ...imagePopoverDisplaySettings,
            [fileURL]: false,
          })
        }
        onClickOutside={() =>
          setImagePopoverDisplaySettings({
            ...imagePopoverDisplaySettings,
            [fileURL]: false,
          })
        }
      >
        <Image fit="contain" src={fileURL} />
        <CloseLayerIconBox
          background="light-2"
          hoverIndicator={{ background: { color: 'light-4' } }}
          border={{ color: 'dark-2' }}
          round
          onClick={(e) => {
            e.stopPropagation()
            setImagePopoverDisplaySettings({
              ...imagePopoverDisplaySettings,
              [fileURL]: false,
            })
          }}
        >
          <FormClose size="large" />
        </CloseLayerIconBox>
      </Layer>
    )
  })

  function onDragEnd(result: any) {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const reorderedImages = reorder(formState[id], result.source.index, result.destination.index)

    setFormState({
      ...formState,
      [id]: reorderedImages,
    })
  }

  if (readOnlyMode) {
    return (
      <ReadOnlyBox width={width || '100%'}>
        <ReadOnlyTitle>{name}</ReadOnlyTitle>
        <ImagesBox readOnly={readOnlyMode}>
          {_.values(
            _.map(formState[id] || [], (fileURL: any, fileURLIndex: number) => {
              return (
                <ImageBox
                  key={fileURL}
                  height="xsmall"
                  width="xsmall"
                  margin={{ right: 'small' }}
                  round
                  overflow="hidden"
                  background={{ image: `url(${fileURL})`, size: 'contain' }}
                  border={{ color: 'dark-2' }}
                  onClick={() => {
                    if (fileURL.includes('pdf')) {
                      window.open(fileURL, '_blank')
                    } else {
                      setImagePopoverDisplaySettings({
                        ...imagePopoverDisplaySettings,
                        [fileURL]: true,
                      })
                    }
                  }}
                >
                  {imagePopoverDisplaySettings[fileURL as keyof typeof imagePopoverDisplaySettings] &&
                    popoverLayers[fileURLIndex]}
                </ImageBox>
              )
            }),
          )}
        </ImagesBox>
      </ReadOnlyBox>
    )
  }

  return (
    <AutoFormField
      label={name}
      key={id}
      name={id}
      required={required}
      help={help}
      validate={validate}
      disabled={disabled}
      width={width}
      error={errors[id]}
    >
      <FileInput
        name={id}
        accept="image/*,application/pdf"
        multiple
        onChange={async (event: any) => {
          const fileList = event?.target?.files
          const uploadURLs = await Promise.all(
            Object.values(fileList).map(async (file: any) => {
              const fileBuffer = await file.arrayBuffer()
              const hashBuffer = await crypto.subtle.digest('SHA-1', fileBuffer)
              const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
              const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
              const fileExtension = _.last(file.name.split('.'))
              const fileName = `images/${hashHex}.${fileExtension}`
              // const upload = await uploadBytes(contractRef, file)
              // await uploadBytes(contractRef, file)
              const arweaveTempURL = ''
              const fileURL = `${arweaveTempURL}${fileName}`
              // const url = getDownloadURL(upload.ref)
              return fileURL
            }),
          )
          setFormState({
            ...formState,
            [id]: [...(formState[id] || []), ...uploadURLs],
          })
        }}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided: any) => (
            <ImagesBox readOnly={readOnlyMode} ref={provided.innerRef} {...provided.droppableProps}>
              {_.values(
                _.map(formState[id] || [], (fileURL: any, fileURLIndex: number) => {
                  return (
                    <Draggable key={fileURL} draggableId={fileURL} index={fileURLIndex}>
                      {(draggableProvided: DraggableProvided) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <Stack key={fileURL} anchor="top-right" margin={{ right: 'small' }}>
                            <ImageBox
                              key={fileURL}
                              height="xsmall"
                              width="xsmall"
                              round
                              overflow="hidden"
                              background={{ image: `url(${fileURL})`, size: 'contain' }}
                              border={{ color: 'dark-2' }}
                              onClick={() => {
                                if (fileURL.includes('pdf')) {
                                  window.open(fileURL, '_blank')
                                } else {
                                  setImagePopoverDisplaySettings({
                                    ...imagePopoverDisplaySettings,
                                    [fileURL]: true,
                                  })
                                }
                              }}
                            >
                              {imagePopoverDisplaySettings[fileURL as keyof typeof imagePopoverDisplaySettings] &&
                                popoverLayers[fileURLIndex]}
                            </ImageBox>
                            <DeleteImageIconBox
                              background="light-2"
                              hoverIndicator={{ background: { color: 'light-4' } }}
                              border={{ color: 'dark-2' }}
                              margin={{ right: 'xsmall', top: 'xsmall' }}
                              round
                              onClick={(e) => {
                                e.stopPropagation()
                                setFormState({
                                  ...formState,
                                  [id]: formState[id].filter((val: any, j: number) => j !== fileURLIndex),
                                })
                              }}
                            >
                              <FormClose />
                            </DeleteImageIconBox>
                          </Stack>
                        </div>
                      )}
                    </Draggable>
                  )
                }),
              )}
            </ImagesBox>
          )}
        </Droppable>
      </DragDropContext>
    </AutoFormField>
  )
}

export default ImagesField
