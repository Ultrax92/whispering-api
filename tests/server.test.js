import supertest from 'supertest'
import { app } from '../server.js'
import { restoreDb, populateDb } from './utils.js'
import { fixtures, inventedId, existingId } from './fixtures.js'
import { getById } from '../store.js'

describe('Server', () => {
  beforeEach(() => populateDb(fixtures))
  afterAll(restoreDb)

  describe('GET /api/v1/whisper', () => {
    it("Should return an empty array when there's no data", async () => {
      restoreDb()
      const response = await supertest(app).get('/api/v1/whisper')
      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('Should return all the whispers', async () => {
      const response = await supertest(app).get('/api/v1/whisper')
      expect(response.status).toBe(200)
      expect(response.body).toEqual(fixtures)
    })
  })

  describe('GET /api/v1/whisper/:id', () => {
    it("Should return a 404 when the whisper doesn't exist", async () => {
      const response = await supertest(app).get(`/api/v1/whisper/${inventedId}`)
      expect(response.status).toBe(404)
    })

    it('Should return a whisper details', async () => {
      const response = await supertest(app).get(`/api/v1/whisper/${existingId}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(fixtures.find(w => w.id === existingId))
    })
  })

  describe('POST /api/v1/whisper', () => {
    it('Should return a 400 when the body is empty', async () => {
      await supertest(app)
        .post('/api/v1/whisper')
        .send({})
    })

    it('Should return a 201 when the whisper is created', async () => {
      const newWhisper = {
        id: fixtures.length + 1,
        message: 'This is a new whisper'
      }

      const response = await supertest(app)
        .post('/api/v1/whisper')
        .send({ message: newWhisper.message })

      expect(response.status).toBe(201)
      expect(response.body).toEqual(newWhisper)
      const storedWhisper = await getById(newWhisper.id)
      expect(storedWhisper).toStrictEqual(newWhisper)
    })
  })

  describe('PUT /api/v1/whisper/:id', () => {
    it("Should return a 404 when the whisper doesn't exist", async () => {
      await supertest(app)
        .put(`/api/v1/whisper/${inventedId}`)
        .send({ message: 'Whisper updated' })
    })

    it('Should return a 200 when the whisper is updated', async () => {
      const response = await supertest(app)
        .put(`/api/v1/whisper/${existingId}`)
        .send({ message: 'Whisper updated' })

      expect(response.status).toBe(200)
      const storedWhisper = await getById(existingId)
      expect(storedWhisper).toStrictEqual({ id: existingId, message: 'Whisper updated' })
    })
  })

  describe('DELETE /api/v1/whisper/:id', () => {
    it("Should return a 404 when the whisper doesn't exist", async () => {
      await supertest(app).delete(`/api/v1/whisper/${inventedId}`)
    })

    it('Should return a 200 when the whisper is deleted', async () => {
      const response = await supertest(app).delete(`/api/v1/whisper/${existingId}`)
      expect(response.status).toBe(200)
      const storedWhisper = await getById(existingId)
      expect(storedWhisper).toBeUndefined()
    })
  })
})
