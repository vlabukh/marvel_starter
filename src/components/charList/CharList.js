import {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from '../../services/MarvelService'
import './charList.scss'

const CharList = ({onCharSelected, selectedChar}) => {
  const [charList, setCharList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [newItemLoading, setNewItemLoading] = useState(false)
  const [offset, setOffset] = useState(210)
  const [charEnded, setCharEnded] = useState(false)
  
  const marvelService = new MarvelService()

  useEffect(() => {
    onRequest()
  }, [])


  const onRequest = (offset) => {
    onCharListLoading()
    marvelService.getAllCharacters(offset)
      .then(onCharListLoaded)
      .catch(onError)
  }

  const onCharListLoading = () => {
    setNewItemLoading(true)
  }

  const onCharListLoaded = (newCharList) => {
    let ended = false
    if (newCharList.length < 9) {
      ended = true
    }
    
    setCharList(charList => [...charList, ...newCharList])
    setLoading(false)
    setNewItemLoading(false)
    setOffset(offset => offset + 9)
    setCharEnded(ended)
  }

  const onError = () => {
    setError(true)
    setLoading(false)
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
        console.log(activeRef.current)
        console.log(activeRef)
        localClassName += ' char__item_selected'
      }
      return (
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
      )
    })
    // А эта конструкция вынесена для центровки спиннера/ошибки
    return (
      <ul className='char__grid'>
        {items}
      </ul>
    )
  }

  const items = renderItems(charList)

  const errorMessage = error ? <ErrorMessage/> : null
  const spinner = loading ? <Spinner/> : null
  const content = !(loading || error) ? items : null

  return (
    <div className='char__list'>
      {errorMessage}
      {spinner}
      {content}
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