import { useHttp } from "../hooks/http.hook"

const useMarvelService = () => {
  const {loading, request, error, clearError} = useHttp()

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
  const _apiKey = 'apikey=c1f1d6bf771207bcdbd7651a228e3fef'
  const _baseOffset = 1544

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`)
    return res.data.results.map(_transformCharacter)
  }
  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`)
    // console.log(res, this._transformCharacter(res.data.results[0]))
    return _transformCharacter(res.data.results[0])
  }
  const _transformDescription = (desc, lng) => {
    if (desc === '') return 'There is no description for this character'
    else return desc.slice(0, lng) + '...'
  }
  const _transformCharacter = (char) => {
    const {name, description, thumbnail, urls, comics} = char
    return {
      id: char.id,
      name,
      description: _transformDescription(description, 100),
      thumbnail: thumbnail.path + '.' + thumbnail.extension,
      homepage: urls[0].url,
      wiki: urls[1].url,
      comics: comics.items
    }
  }

  return {loading, error, clearError, getAllCharacters, getCharacter, _baseOffset}
}

export default useMarvelService