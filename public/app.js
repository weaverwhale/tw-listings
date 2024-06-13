const { createApp } = Vue

const app = createApp({
  data() {
    return {
      data: {},
      search: '',
      loading: false,
      path: new URL(location.href).searchParams.get('path') || './@tw',
      folderFilter: '',
      typeFilter: '',
      sort: ''
    }
  },
  computed: {
    filteredData() {
      return (this.search.trim().length > 0 
        ? fuzzysort.go(this.search, this.data?.data, {
          keys: ['file', obj => obj.exports?.map(e => e.name).join(), obj => obj.exports?.map(e => e.type).join()],
          threshold: 0.4
        }) 
        : this.data?.data ?? []
      )
        ?.map(d => d.obj ?? d)
        ?.filter(i => i.file.includes(this.folderFilter) || this.folderFilter === '')
        ?.filter(i => i.exports.some(e => e.type.includes(this.typeFilter)) || this.typeFilter === '')
        ?.filter(i => i.exports.length > 0)
        ?.sort((a, b) => {
        if (this.sort === 'asc') {
          return a.file.localeCompare(b.file)
        } else if (this.sort === 'desc') {
          return b.file.localeCompare(a.file)
        }
      })
    },
    totalFiles() {
      return this.data?.data?.length ?? 0
    },
    totalExports() {
      return this.data?.data?.reduce((acc, item) => acc + item.exports.length, 0) ?? 0
    },
    topLevelFolders() {
      return this.data?.data?.length > 0 && this.data?.data?.map((item) => {
        return item.file?.split('/')[1]
      })?.reduce((acc, item) => {
        if (!acc.includes(item) && item !== '@tw') {
          acc.push(item)
        }
        return acc
      }, [])
    },
    availableTypes() {
      return this.data?.data?.length > 0 && this.data?.data?.map((item) => {
        return item.exports?.map(e => e.type)
      })
      ?.reduce((acc, item) => {
        item.forEach((type) => {
          if (!acc.includes(type) && type.length > 0 && type.length < 30) {
            acc.push(type)
          }
        })
        return acc
      }, [])
    },
    hasFilterOrSearch() {
      return this.search.trim().length > 0 || this.folderFilter !== ''
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      fetch('/get-folder-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: this.path,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.data = data
        }).finally(() => {
          this.loading = false
        })
    },
    reset() {
      this.search = ''
      this.folderFilter = ''
    }
  },
})

document.addEventListener('DOMContentLoaded', () => {
  app.mount('#app')
})