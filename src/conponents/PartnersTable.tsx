import { useEffect, useState } from 'react';
import { Button, Flex, Modal, Space, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import ModalComponent from './ModalComponent';

import {
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { partnerAPI } from '../services/PartnerSevice';
import { Partner } from './models/Partner';

const filterColumn = <T extends Partner>(arr: T[], key: keyof T): { text: string, value: string }[] => {
    if (!arr || arr.length === 0) return []
    const uniqueValues = [...new Set(arr.map(item => String(item[key])))]
    return uniqueValues.map(value => ({
        text: String(value),
        value: String(value)
    }))
}

function PartnersTable() {
    const [selectedPartner, setSelectedPartner] = useState<Partner>();
    const [open, setOpen] = useState(false);
    // let itemsCount = 0
    const { data: parntersData, isLoading, } = partnerAPI.useGetAllPartnersQuery(50)
    // itemsCount = parntersData?.metaData.itemsCount ?? 0
    const partnersDataKey = parntersData?.data.map(item => ({ ...item, key: item.id })) || []

    const [createPartner, { isLoading: isCreateLoading }] = partnerAPI.useCreatePartnerMutation()
    const [updatePartner, { error: updateError }] = partnerAPI.useUpdatePartnerMutation()
    const [deletePartner] = partnerAPI.useDeletePartnerMutation()

    const handleRemove = (partner: Partner) => {
        Modal.confirm({
            centered: true,
            title: 'Удалить запись?',
            onOk: () => {
                deletePartner(partner)
            }
        })
    }

    useEffect(() => {
        if (updateError) {
            Modal.error({
                title: 'ОШИБКА',
                content: <p>{updateError}</p>
            })
        }
    }, [updateError])

    const handleUpdate = (partner: Partner) => {
        setSelectedPartner(partner);
        setOpen(true)
    }

    const columns: TableColumnsType<Partner> = [
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
            filters: filterColumn(partnersDataKey, 'name'),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.name.startsWith(value as string),
            width: '20%',
        },
        {
            title: 'Группа',
            dataIndex: 'group',
            key: 'group',
            filters: filterColumn(partnersDataKey, 'group'),
            onFilter: (value, record) => record.group.startsWith(value as string),
            width: '20%',
        },
        {
            title: 'ИНН',
            dataIndex: 'inn',
            key: 'inn',
            filters: filterColumn(partnersDataKey, 'inn'),
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
            render: (record) => {
                return (
                    <Flex justify='center'>
                        <Space size={20}>
                            <EditOutlined onClick={() => handleUpdate(record)} />
                            <DeleteOutlined onClick={() => handleRemove(record)} />
                        </Space>
                    </Flex>
                )
            }
        },
    ];

    return (
        <>
            <div style={{ margin: '10px 20px' }}>
                <Button type="primary" onClick={() => setOpen(true)}>
                    Добавить контрагента
                </Button>
                {open && (
                    <ModalComponent
                        setOpen={setOpen}
                        open={open}
                        createPartner={createPartner}
                        isCreateLoading={isCreateLoading}
                        selectedPartner={selectedPartner}
                        updatePartner={updatePartner}
                        setSelectedPartner={setSelectedPartner}
                    />
                )}
            </div>
            <Table<Partner>
                pagination={{ hideOnSinglePage: true }}
                bordered
                size='small'
                loading={isLoading}
                columns={columns}
                dataSource={partnersDataKey}
                style={{
                    margin: '5px 20px',
                    borderRadius: '10px 10px 0 0',
                }}
            />
        </>
    )
}

export default PartnersTable