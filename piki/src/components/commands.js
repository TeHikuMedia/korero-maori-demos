
commands = [
  {
    'action': 'get_howareyou',
    'response': 'pai no iho',
    'phrases_text': `
      kei te pēhea koe
      e pehea ana koe
      `,
  },
  {
    'action': 'get_thatsgood',
    'response': 'ka nui te pai',
    'phrases_text': `
      kei te pai ahau
      kei te pai au
      e pai ana ahau
      e pai ana au
      `,
  },
  {
    'action': 'get_greeting',
    'response': 'tēnā koe, e hoa. e pehea ana koe?',
    'phrases_text': `
      tēnā koe
      tēnā koe piki
      kia ora piki
      `,
  },
  {
    'action': 'get_kainga',
    'response': 'No kaitaia ahau',
    'phrases_text': `
      no hea koe
      `,
  },
  {
    'action': 'get_weather',
    'url': '',
    'phrases_text': `
      E pehea ana te rangi
      E pehea ana te ahua o te rangi
      He aha te huarere mō tēnei rā
      He aha te huarere i tēnei rā
      He aha te hurarere
      `,
  },
  {
    'action': 'play_stream',
    'media_url': 'http://radio.tehiku.live:8030/stream;1',
    'url': 'https://tehiku.nz/api/?channel=te-hiku-radio',
    'type': 'mp3',
    'response': 'Anei te reo irirangi o te hiku o te ika',
    'phrases_text': `
      Whakatairangahia te reo irirangi o te hiku o te ika
      Whakatairangatia te reo irirangi o te hiku o te ika
      Whakapāhongia te reo irirangi o te hiku o te ika
      Whakapāhotia te reo irirangi o te hiku o te ika
      Whakatairangahia te reo irirangi o te hiku o te ika
      Whakatairangatia te reo irirangi o te hiku o te ika
      Whakapāhongia te reo irirangi o te hiku o te ika
      Whakapāhotia te reo irirangi o te hiku o te ika
      Whakatairangahia te reo irirangi o Muriwhenua
      Whakatairangatia te reo irirangi o Muriwhenua
      Whakapāhongia te reo irirangi o Muriwhenua
      Whakapāhotia te reo irirangi o Muriwhenua
      Whakatairangahia te reo irirangi o Muriwhenua
      Whakatairangatia te reo irirangi o Muriwhenua
      Whakapāhongia te reo irirangi o Muriwhenua
      Whakapāhotia te reo irirangi oMuriwhenua
      e whakarongo ana ahau ki te reo irirangi o te hiku
      e whakaronga ana ahau ki te hiku
      E hiahia ana ahau e whakarongo ki te reo irirangi o te hiku o te ika
      E hiahia ana ahau ki te whakarongo ki te reo irirangi o te hiku o te ika
      E hiahia ana ahau e whakarongo ki te reo irirangi o Muriwhenua
      e hiahia ana au ki te whakarongo ki te reo irirangi o te hiku
      Kei te hiahia ahau e whakarongo ki te reo irirangi o te hiku o te ika
      Kei te hiahia ahau e whakarongo ki te reo irirangi o Muriwhenua
      `
  },
  {
    'action': 'get_panui',
    'media_url': 'https://tehiku.nz/api/te-reo/panui/latest?mp3=True',
    'url': 'https://tehiku.nz/api/te-reo/panui/latest',
    'type': 'mp3',
    'response': 'Anei ngā pānui.',
    'phrases_text': `
      He aha ngā pānui o te hiku o te ika
      He aha ngā pānui o Muriwhenua
      he aha ngā pānui o te hiku
      he aha ngā pānui o te tai tokerau
      Whakatairangahia ngā pānui o te hiku o te ika
      Whakatairangatia ngā pānui o  te hiku o te ika
      Whakapāhongia ngā pānui o  te hiku o te ika
      Whakapāhotia ngā pānui o te hiku o te ika
      Whakatairangahia ngā pānui o te hiku o te ika
      Whakatairangatia ngā pānui o te hiku o te ika
      Whakapāhongia ngā pānui o te hiku o te ika
      Whakapāhotia ngā pānui o te hiku o te ika
      Whakatairangahia ngā pānui o Muriwhenua
      Whakatairangatia ngā pānui o Muriwhenua
      Whakapāhongia ngā pānui o Muriwhenua
      Whakapāhotia ngā pānui o Muriwhenua
      Whakatairangahia ngā pānui o Muriwhenua
      Whakatairangatia ngā pānui o Muriwhenua
      Whakapāhongia ngā pānui o Muriwhenua
      Whakapāhotia ngā pānui o Muriwhenua
    `
  },
  {
    'action': 'get_news',
    'media_url': 'https://tehiku.nz/api/te-reo/nga-take/latest?mp3=True',
    'url': 'https://tehiku.nz/api/te-reo/nga-take/latest',
    'type': 'mp3',
    'response': 'Anei ngā take o te tai tokerau.',
    'phrases_text': `
      He aha ngā take o te hiku o te ika
      He aha ngā take o Muriwhenua
      he aha ngā take o te tai tokerau
      he aha ngā take o te hiku
      Whakatairangahia ngā take o te hiku o te ika
      Whakatairangatia ngā take o te hiku o te ika
      Whakapāhongia ngā take o te hiku o te ika
      Whakapāhotia ngā take o te hiku o te ika
      Whakatairangahia ngā take o te hiku o te ika
      Whakatairangatia ngā take o te hiku o te ika
      Whakapāhongia ngā take o te hiku o te ika
      Whakapāhotia ngā take o te hiku o te ika
      Whakatairangahia ngā take o Muriwhenua
      Whakatairangatia ngā take o Muriwhenua
      Whakapāhongia ngā take o Muriwhenua
      Whakapāhotia ngā take o Muriwhenua
      Whakatairangahia ngā take o Muriwhenua
      Whakatairangatia ngā take o Muriwhenua
      Whakapāhongia ngā take o Muriwhenua
      Whakapāhotia ngā take o Muriwhenua
    `
  },
  {
    'action': 'get_news',
    // 'media_url': '',
    'url': 'https://tehiku.nz/api/te-hiku-tv/haukainga/latest',
    // 'type': 'mp3',
    'response': 'Anei.',
    'phrases_text': `
      Whakatairangahia te hōtaka Haukāinga
      Whakatairangatia te hōtaka Haukāinga
      Whakapāhongia te hōtaka Haukāinga
      Whakapāhotia te hōtaka Haukāinga
      Whakatairangahia te hōtaka Haukāinga
      Whakatairangatia te hōtaka Haukāinga
      Whakapāhongia te hōtaka Haukāinga
      Whakapāhotia te hōtaka Haukāinga
      Whakatairangahia te hōtaka Haukāinga
      Whakatairangatia te hōtaka Haukāinga
      Whakapāhongia te hōtaka Haukāinga
      Whakapāhotia te hōtaka Haukāinga
      Whakatairangahia te hōtaka Haukāinga
      Whakatairangatia te hōtaka Haukāinga
      Whakapāhongia te hōtaka Haukāinga
      Whakapāhotia te hōtaka Haukāinga
    `
  }
]

commands.forEach((command)=>{
  command.phrases = []
  let cs = command.phrases_text.split('\n')
  cs.forEach((line)=>{
    let text = line.trim().toLowerCase()
    if (text != ''){
      command.phrases.push(text)
    }
  })
})

exports.commands = commands

