import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import Frame from '../components/Admin/Frame.js'
import SlideList from '../components/Admin/SlideList.js'
import Upload from '../components/Upload.js'
import Dialog from '../components/Dialog.js'

import { getSlideshow, updateSlideshow } from '../actions/slideshow'

class Slideshow extends React.Component {
  constructor(props) {
    super(props)
    const { slideshow } = props
    this.state = { slideshow }
    this.slideList = React.createRef()
  }

  static async getInitialProps({ query, req }) {
    const id = query && query.id
    const host =
      req && req.headers && req.headers.host ? 'http://' + req.headers.host : window.location.origin
    const slideshow = id && (await getSlideshow(id, host))
    return { slideshow: slideshow }
  }

  refresh = () => {
    const { _id: id } = this.props.slideshow
    return getSlideshow(id).then(slideshow => {
      this.setState({ slideshow }, () => {
        this.slideList && this.slideList.current && this.slideList.current.refresh()
      })
    })
  }

  render() {
    const { slideshow } = this.state
    return (
      <Frame>
        <h1 className='title'>Slideshow: </h1>{' '}
        <div className='editable-title'>
          <input
            className='input'
            placeholder='Enter slideshow name...'
            value={(slideshow && slideshow.title) || 'Untitled Slideshow'}
            onChange={event => {
              const target = event.target
              const title = target && target.value
              this.setState(
                {
                  slideshow: {
                    ...slideshow,
                    title
                  }
                },
                () => {
                  updateSlideshow(slideshow._id, { title }).then(this.refresh)
                }
              )
            }}
            onClick={e => {
              if (e) e.stopPropagation()
            }}
            size={slideshow && slideshow.title && slideshow.title.length}
          />
          <div className='icon'>
            <FontAwesomeIcon icon={faPencilAlt} fixedWidth color='#828282' />
          </div>
        </div>
        <div className='wrapper'>
          <Upload slideshow={slideshow && slideshow._id} refresh={this.refresh} />
          <SlideList ref={this.slideList} slideshow={slideshow && slideshow._id} />
          <Dialog />
        </div>
        <style jsx>
          {`
            h1 {
              font-family: 'Open Sans', sans-serif;
              font-size: 24px;
              color: #4f4f4f;
              margin: 0px;
            }
            .title {
              display: inline-block;
            }
            .editable-title {
              display: inline-block;
              position: relative;
              margin-left: 16px;
              margin-right: 16px;
              border-bottom: 3px solid #aaa;
            }
            .editable-title .input {
              font-family: 'Open Sans', sans-serif;
              color: #666;
              background-color: transparent;
              min-height: 40px;
              border: none;
              outline: none;
              margin-right: 24px;
              font-size: 24px;
              font-weight: 600;
            }
            .editable-title .icon {
              position: absolute;
              right: 8px;
              top: 50%;
              margin-top: -8px;
            }
            .wrapper {
              margin: 40px auto;
              max-width: 640px;
            }
          `}
        </style>
      </Frame>
    )
  }
}

export default Slideshow