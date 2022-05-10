import { useHttp } from '../hooks/http.hook'

const useMarvelService = () => {
  const {request, clearError, process, setProcess} = useHttp()

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
  const _apiKey = 'apikey=c1f1d6bf771207bcdbd7651a228e3fef'
  const _baseCharOffset = 210
  const _baseComicOffset = 210

  const getAllCharacters = async (offset = _baseCharOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`)
    return res.data.results.map(_transformCharacter)
  }
  const getCharacterByName = async (name) => {
    const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`)
    return res.data.results.map(_transformCharacter)
  }
  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`)
    return _transformCharacter(res.data.results[0])
  }
  const getAllComics = async (offset = _baseComicOffset) => {
    const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`)
    return res.data.results.map(_transformComic)
  }
  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`)
    return _transformComic(res.data.results[0])
  }
  const _transformDescription = (desc, lng, who) => {
    if (desc === '' || desc === null) return `There is no description for this ${who}`
    else return desc.slice(0, lng) + '...'
  }
  const _transformCharacter = (char) => {
    const {name, description, thumbnail, urls, comics, id} = char
    return {
      id,
      name,
      description: _transformDescription(description, 210, 'character'),
      thumbnail: thumbnail.path + '.' + thumbnail.extension,
      homepage: urls[0].url,
      wiki: urls[1].url,
      comics: comics.items
    }
  }
  const _transformComic = (comic) => {
    const {title, description, pageCount, thumbnail, prices, id} = comic
    return {
      id,
      title,
      description: _transformDescription(description, 210, 'comic'),
      pageCount: pageCount ? `${pageCount} p.` : 'No information about the number of pages',
      thumbnail: thumbnail.path + '.' + thumbnail.extension,
      language: comic.textObjects.language || 'en-us',
      price: prices[0].price ? `${prices[0].price}$` : 'not available'
    }
  }

  return {clearError, process, setProcess,
    getAllCharacters, getCharacterByName, getCharacter, _baseCharOffset,
    getAllComics, getComic, _baseComicOffset,
  }
}

export default useMarvelService