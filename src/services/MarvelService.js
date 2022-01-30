class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/'
  _apiKey = 'apikey=c1f1d6bf771207bcdbd7651a228e3fef'
  _baseOffset = 210

  getResource = async (url) => {
    let res = await fetch(url)

    if (!res.ok) {
      throw Error(`Could not fetch ${url}, status: ${res.status}`)
    }

    return await res.json()
  }
  getAllCharacters = async (offset = this._baseOffset) => {
    const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`)
    return res.data.results.map(this._transformCharacter)
  }
  getCharacter = async (id) => {
    const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`)
    // console.log(res, this._transformCharacter(res.data.results[0]))
    return this._transformCharacter(res.data.results[0])
  }
  _transformDescription = (desc, lng) => {
    if (desc === '') return 'There is no description for this character'
    else return desc.slice(0, lng) + '...'
  }
  _transformCharacter = (char) => {
    const {name, description, thumbnail, urls, comics} = char
    return {
      id: char.id,
      name,
      description: this._transformDescription(description, 100),
      thumbnail: thumbnail.path + '.' + thumbnail.extension,
      homepage: urls[0].url,
      wiki: urls[1].url,
      comics: comics.items
    }
  }
}

export default MarvelService