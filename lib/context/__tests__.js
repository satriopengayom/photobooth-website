// Test file untuk validasi PhotoSessionContext
// Jalankan test manual di browser console atau component

/*
Test Cases:

1. Initialize session dengan 3 foto:
   startSession({ photoCount: 3, countdown: 5, mode: 'manual', method: 'per-foto', gesture: 'peace' })
   Expected: photos array length = 3, semua slot blob: null

2. Initialize session dengan 4 foto:
   startSession({ photoCount: 4, countdown: 3, mode: 'gesture', method: 'per-sesi', gesture: 'palm' })
   Expected: photos array length = 4, semua slot blob: null

3. Add photo ke slot 0:
   const mockBlob = new Blob(['test'], { type: 'image/jpeg' })
   addPhoto(0, mockBlob)
   Expected: photos[0].blob = mockBlob, photos[1-3] tetap null

4. Add photo ke slot 2:
   addPhoto(2, mockBlob)
   Expected: photos[2].blob = mockBlob, photos lain tidak berubah

5. Check session complete dengan slot kosong:
   isSessionComplete()
   Expected: false (masih ada slot dengan blob: null)

6. Fill semua slots:
   addPhoto(0, mockBlob)
   addPhoto(1, mockBlob)
   addPhoto(2, mockBlob)
   addPhoto(3, mockBlob)
   isSessionComplete()
   Expected: true

7. Get next empty slot:
   getNextEmptySlot()
   Expected: index dari slot pertama yang blob: null, atau -1 jika semua terisi

8. Retake slot 2:
   setRetakeSlot(2)
   Expected: retakeSlot = 2

9. Clear retake:
   clearRetake()
   Expected: retakeSlot = null

10. Reset session:
    resetSession()
    Expected: photos = [], sessionStarted = false, settings reset ke default
*/

export const contextTestScenarios = {
  test1: {
    name: 'Initialize session 3 foto',
    action: (ctx) => ctx.startSession({ photoCount: 3, countdown: 5, mode: 'manual', method: 'per-foto', gesture: 'peace' }),
    validate: (ctx) => ctx.photos.length === 3 && ctx.photos.every(p => p.blob === null)
  },
  test2: {
    name: 'Initialize session 4 foto',
    action: (ctx) => ctx.startSession({ photoCount: 4, countdown: 3, mode: 'gesture', method: 'per-sesi', gesture: 'palm' }),
    validate: (ctx) => ctx.photos.length === 4 && ctx.photos.every(p => p.blob === null)
  },
  test3: {
    name: 'Add photo ke slot 0',
    action: (ctx) => {
      ctx.startSession({ photoCount: 4, countdown: 3, mode: 'manual', method: 'per-foto', gesture: 'peace' })
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' })
      ctx.addPhoto(0, mockBlob)
    },
    validate: (ctx) => ctx.photos[0].blob !== null && ctx.photos[1].blob === null
  },
  test4: {
    name: 'isSessionComplete with empty slots',
    action: (ctx) => {
      ctx.startSession({ photoCount: 3, countdown: 3, mode: 'manual', method: 'per-foto', gesture: 'peace' })
    },
    validate: (ctx) => ctx.isSessionComplete() === false
  },
  test5: {
    name: 'getNextEmptySlot',
    action: (ctx) => {
      ctx.startSession({ photoCount: 4, countdown: 3, mode: 'manual', method: 'per-foto', gesture: 'peace' })
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' })
      ctx.addPhoto(0, mockBlob)
      ctx.addPhoto(1, mockBlob)
    },
    validate: (ctx) => ctx.getNextEmptySlot() === 2
  },
  test6: {
    name: 'Retake slot',
    action: (ctx) => {
      ctx.setRetakeSlot(2)
    },
    validate: (ctx) => ctx.retakeSlot === 2
  }
}
