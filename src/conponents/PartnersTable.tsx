import { Flex, Space, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';

import {
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';

interface DataType {
    id: string
    name: string
    inn: string
    kpp: string
    group: string
    description: null
}

type Data = {
    id: string
    name: string
    inn: string
    kpp: string
    group: string
    description: null
}
const data: DataType[] = [
    {
        id: "fc373a5f-b681-410c-a2e7-e67f416d948e",
        name: 'ООО "ФИНПРОФИ КОНСАЛТИНГ"',
        inn: "4632230060",
        kpp: "463201001",
        group: "Не распределен!",
        description: null
    },
    {
        id: "5119b133-d375-4611-a2e9-535a8c826d50",
        name: 'ФИЛИАЛ "ЦЕНТРАЛЬНЫЙ" БАНКА ВТБ (ПАО)',
        inn: "7702070139",
        kpp: "770943002",
        group: "Не распределен!",
        description: null
    },
    {
        id: "e04bc912-bb72-4d21-9d8c-af3b08299f54",
        name: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ЛАБОРАТОРИЯ УМНОГО ВОЖДЕНИЯ"',
        inn: "7722322049",
        kpp: "771401001",
        group: "Не распределен!",
        description: null
    },
    {
        id: "adfcfcf1-1bcd-4e8b-a432-0f59495f0599",
        name: "ООО Белмонт Трейдинг Восток",
        inn: "7707764099",
        kpp: "781001001",
        group: "Не распределен!",
        description: null
    },

];

const dataKey = data.map(item => ({ ...item, key: item.id }))
console.log(dataKey);

const filterColumn = <T extends Data>(arr: T[], key: keyof T): { text: string, value: string }[] => {
    const uniqueValues = Array.from(new Set(arr.map(item => String(item[key]))))
    return uniqueValues.map((value => ({
        text: String(value),
        value: String(value)
    })))
}

const columns: TableColumnsType<DataType> = [
    {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name',
        filters: filterColumn(dataKey, 'name'),
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value, record) => record.name.startsWith(value as string),
        width: '20%',
    },
    {
        title: 'Группа',
        dataIndex: 'group',
        key: 'group',
        filters: filterColumn(dataKey, 'group'),
        onFilter: (value, record) => record.group.startsWith(value as string),
        width: '20%',
    },
    {
        title: 'ИНН',
        dataIndex: 'inn',
        key: 'inn',
        filters: filterColumn(dataKey, 'inn'),
        onFilter: (value, record) => record.inn.startsWith(value as string),
        filterSearch: true,
        width: '20%',
    },
    {
        title: 'Комментарии',
        dataIndex: 'description',
        key: 'description',
        width: '20%',
    },
    {
        title: 'Действия',
        width: '20%',
        render: () => {
            return (
                <Flex justify='center'>
                    <Space size={20}>
                        <EditOutlined />
                        <DeleteOutlined />
                    </Space>
                </Flex>
            )
        }
    },
];

function PartnersTable() {

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <Table<DataType>
            bordered
            columns={columns}
            dataSource={dataKey}
            onChange={onChange}
            style={{
                margin: 20,
                borderRadius: '10px 10px 0 0',
            }}
        />
    )
}

export default PartnersTable