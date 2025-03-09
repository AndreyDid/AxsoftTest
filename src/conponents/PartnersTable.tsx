import { useState } from 'react';
import { Button, Flex, Space, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import ModalComponent from './ModalComponent';

import {
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';

export interface IDataType {
    id: string
    name: string
    inn: string
    kpp: string
    group: string
    description: string | null
}

type Data = {
    id: string
    name: string
    inn: string
    kpp: string
    group: string
    description: null | string
}

const filterColumn = <T extends Data>(arr: T[], key: keyof T): { text: string, value: string }[] => {
    const uniqueValues = Array.from(new Set(arr.map(item => String(item[key]))))
    return uniqueValues.map((value => ({
        text: String(value),
        value: String(value)
    })))
}

function PartnersTable() {
    const [partners, setPartners] = useState<IDataType[]>([])
    const partnersKey = partners.map(item => ({ ...item, key: item.id }))
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };

    const columns: TableColumnsType<IDataType> = [
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
            filters: filterColumn(partnersKey, 'name'),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.name.startsWith(value as string),
            width: '20%',
        },
        {
            title: 'Группа',
            dataIndex: 'group',
            key: 'group',
            filters: filterColumn(partnersKey, 'group'),
            onFilter: (value, record) => record.group.startsWith(value as string),
            width: '20%',
        },
        {
            title: 'ИНН',
            dataIndex: 'inn',
            key: 'inn',
            filters: filterColumn(partnersKey, 'inn'),
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

    return (
        <>
            <div style={{ margin: '10px 20px' }}>
                <Button type="primary" onClick={showModal}>
                    Добавить контрагента
                </Button>
                {setOpen && <ModalComponent setOpen={setOpen} open={open} setPartners={setPartners} />}
            </div>
            <Table<IDataType>
                bordered
                columns={columns}
                dataSource={partnersKey}
                style={{
                    margin: '5px 20px',
                    borderRadius: '10px 10px 0 0',
                }}
            />
        </>
    )
}

export default PartnersTable