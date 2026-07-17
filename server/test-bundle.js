const apiUrl = process.env.CURIO_API_URL || 'http://localhost:3001/api/generate-bundle'

const sampleInputs = [
  { age: 5, interest: 'dinosaurs', minutes: 10 },
  { age: 8, interest: 'outer space', minutes: 15 },
  { age: 12, interest: 'ocean animals', minutes: 20 },
]

async function testBundle(input) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  const payload = await response.json().catch(() => ({ error: 'The API returned invalid JSON.' }))

  console.log(`\n${'='.repeat(72)}`)
  console.log(`Age ${input.age} | Interest: ${input.interest} | ${input.minutes} minutes`)
  console.log(`HTTP ${response.status}`)
  console.log(JSON.stringify(payload, null, 2))
}

async function main() {
  console.log(`Testing Curio bundle generation at ${apiUrl}`)

  for (const input of sampleInputs) {
    try {
      await testBundle(input)
    } catch (error) {
      console.error(`\nRequest failed for ${input.interest}: ${error.message}`)
    }
  }
}

main()
