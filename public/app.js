const { createApp } = Vue

createApp({
  data() {
    return {
      data: {},
      search: '',
      loading: false,
      path: new URL(location.href).searchParams.get('path') || './@tw',
      folderFilter: '',
      sort: 'desc'
    }
  },
  computed: {
    filteredData() {
      return (this.data?.data?.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(this.search.trim().toLowerCase()) && item.exports.length > 0 && item.file.includes(this.folderFilter)
      }) || []).sort((a, b) => {
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
        if (!acc.includes(item)) {
          acc.push(item)
        }
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
}).mount('#app')