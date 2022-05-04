import {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import useMarvelService from '../../services/MarvelService'
import './charList.scss'

const CharList = ({onCharSelected, selectedChar}) => {
  const {loading, error, getAllCharacters, _baseCharOffset} = useMarvelService()

  const [charList, setCharList] = useState([])
  const [newItemLoading, setNewItemLoading] = useState(false)
  const [offset, setOffset] = useState(_baseCharOffset)
  const [charEnded, setCharEnded] = useState(false)
  
  useEffect(() => {
    onRequest(offset, true)
  }, [])


  const onRequest = (offset, initial) => {
    setNewItemLoading(initial ? false : true)
    getAllCharacters(offset)
      .then(onCharListLoaded)
  }

  const onCharListLoaded = (newCharList) => {

    let ended = false
    if (newCharList.length < 9) {
      ended = true
    }
    
    setCharList(charList => [...charList, ...newCharList])
    setNewItemLoading(false)
    setOffset(offset => offset + 9)
    setCharEnded(ended)
  }

  const activeRef = useRef()

  // Этот метод создан для оптимизации, 
  // чтобы не помещать такую конструкцию в метод render
  const renderItems = (arr) => {
    const items =  arr.map((item) => {
      let imgStyle = {'objectFit' : 'cover'}
      if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'}
      }
      let localRef = null
      let localClassName = 'char__item'
      if (selectedChar === item.id) {
        localRef = activeRef
        localClassName += ' char__item_selected'
      }
      return (
        <CSSTransition key={item.id} timeout={500} classNames='char__item'>
          <li
            className={localClassName}
            ref={localRef}
            tabIndex={0}
            key={item.id}
            onClick={() => onCharSelected(item.id)}
            onKeyPress={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                onCharSelected(item.id)
              }
            }}>
              <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
              <div className='char__name'>{item.name}</div>
          </li>
        </CSSTransition>
      )
    })
    // А эта конструкция вынесена для центровки спиннера/ошибки
    return (
      <ul className='char__grid'>
        <TransitionGroup component={null}>
          {items}
        </TransitionGroup>
      </ul>
    )
  }

  const items = renderItems(charList)

  const errorMessage = error ? <ErrorMessage/> : null
  const spinner = loading && !newItemLoading ? <Spinner/> : null

  console.log('charList!')
  return (
    <div className='char__list'>
      {errorMessage}
      {spinner}
      {items}
      <button 
        className='button button__main button__long'
        disabled={newItemLoading}
        style={{'display': charEnded ? 'none' : 'block'}}
        onClick={() => onRequest(offset)}>
        <div className='inner'>load more</div>
      </button>
    </div>
  )
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
}

export default CharList