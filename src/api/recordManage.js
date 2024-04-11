import request from '@/utils/request'

export default {
  getRecordList(searchModel) {
    return request({
      url: '/sys/record/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        id: searchModel.id,
        userId: searchModel.userId,
        username: searchModel.username
      }
    })
  },
  deleteRecordById(id) {
    return request({
      url: `/sys/record/${id}`,
      method: 'delete'
    })
  }
}
