const { createApp } = Vue

createApp({
  data() {
    return {
      data: {},
      search: '',
      loading: false,
      path: new URL(location.href).searchParams.get('path') || './@tw'
    }
  },
  computed: {
    filteredData() {
      return this.data?.data?.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(this.search.trim().toLowerCase()) && item.exports.length > 0
      }) || []
    },
    totalFiles() {
      return this.data?.data?.length ?? 0
    },
    totalExports() {
      return this.data?.data?.reduce((acc, item) => acc + item.exports.length, 0) ?? 0
    },
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
  },
}).mount('#app')