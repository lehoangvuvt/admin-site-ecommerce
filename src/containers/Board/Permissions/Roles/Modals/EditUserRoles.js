import { useEffect, useState } from "react";
import { Modal, Form, message, Button, Select } from "antd";
import axios from "axios";

const EditUserRoles = (props) => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    let result = props.roles.filter((o1) =>
      props.data.userRole.some((o2) => o1.ID === o2.ROLE_ID)
    );
    let data = [];
    result.map((item) => data.push(item.ID));
    setUserRoles(data);
  }, [props]);

  const createUserRoles = async (values) => {
    let deleteRoles = userRoles.filter((x) => !values.roles.includes(x));
    await axios
      .post(
        "http://localhost:5035/permissions/user/roles",
        {
          USER_ID: props.data.SID,
          ROLE_IDS: values.roles,
          DELETE_IDS: deleteRoles,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setIsLoading(false);
        handleCancle();
        form.resetFields();
        props.getUsers();
        console.log(res.data);
      })
      .catch((e) => {
        setIsLoading(false);
        if (e.response) {
          if (e.response.status === 403)
            message.error("Cannot access this resource!");
        }
      });
  };

  const handleOpen = () => {
    form.setFieldsValue({
      roles: userRoles,
    });
    setVisible(true);
  };

  const handleCancle = () => {
    setVisible(false);
  };

  const handleSubmit = (values) => {
    createUserRoles(values);
  };

  return (
    <div>
      <Button type="primary" size="middle" onClick={handleOpen}>
        Edit
      </Button>
      <Modal
        visible={visible}
        title="Edit Role's Permissions"
        okText="Edit"
        cancelText="Cancel"
        confirmLoading={isLoading}
        onCancel={handleCancle}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleSubmit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="roles"
            label="Roles"
            rules={[
              {
                required: true,
                message: "Please select at least 1 right!",
              },
            ]}
          >
            <Select mode="multiple" allowClear placeholder="Please select">
              {props.roles.map((item) => (
                <Select.Option value={item.ID}>{item.ROLE_NAME}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditUserRoles;
