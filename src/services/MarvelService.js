class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/'
  _apiKey = 'apikey=c1f1d6bf771207bcdbd7651a228e3fef'
  getResource = async (url) => {
    let res = await fetch(url)

    if (!res.ok) {
      throw Error(`Could not fetch ${url}, status: ${res.status}`)
    }

    return await res.json()
  }
  getAllCharacters = async () => {
    const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`)
    return res.data.results.map(this._transformCharacter)
  }
  getCharacter = async (id) => {
    const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`)
    console.log(res, this._transformCharacter(res.data.results[0]))
    return this._transformCharacter(res.data.results[0])
  }
  _transformDescription = (desc) => {
    if (desc === '') return 'Empty description'
    else if (desc.length > 80) return desc.slice(0, 80) + '...'
  }
  _transformCharacter = (char) => {
    const {name, description, thumbnail, urls} = char
    return {
      name,
      description: this._transformDescription(description),
      thumbnail: thumbnail.path + '.' + thumbnail.extension,
      homepage: urls[0].url,
      wiki: urls[1].url
    }
  }
}

export default MarvelService