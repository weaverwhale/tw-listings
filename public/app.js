const { createApp } = Vue

createApp({
  data() {
    return {
      data: {},
      search: '',
    }
  },
  computed: {
    filteredData() {
      return this.data?.data?.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(this.search.trim().toLowerCase())
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
      fetch('/get-folder-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: new URL(location.href).searchParams.get('path') || './@tw',
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.data = data
        })
    },
  },
}).mount('#app')