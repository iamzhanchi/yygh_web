import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}
export default {
  // 数据字典列表
  dictList(id) {
    return request({
      url: `/admin/cmn/dict/findChildData/${id}`,
      method: 'get',
    })
  }
}