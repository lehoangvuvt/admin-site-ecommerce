import { useEffect, useState } from "react";
import { Modal, Form, Button, Select, message } from "antd";
import axios from "axios";

const CreateRolePerm = (props) => {
  const [visible, setVisible] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const basicRights = ["GET", "POST", "PUT", "DELETE"];

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    await axios
      .get("http://localhost:5035/permissions/roles", { withCredentials: true })
      .then((res) =>
        res.data.roles.length > 0 ? setRoles(res.data.roles) : []
      )
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 403)
            message.error("Cannot access this resource!");
        }
      });
  };

  const createRolePerm = async (values) => {
    await axios
      .post(
        "http://localhost:5035/permissions/roles/perm",
        {
          RIGHT: values.rights.toString(),
          RESOUCRE_ID: values.resources,
          ROLE_ID: values.role,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setIsLoading(false);
        handleCancle();
        form.resetFields();
        props.getRolesPerm();
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
    setVisible(true);
  };

  const handleCancle = () => {
    setVisible(false);
  };

  const handleSubmit = (values) => {
    setIsLoading(true);
    createRolePerm(values);
  };

  return (
    <div>
      <Button
        style={{
          background: "#3f51b5",
          borderColor: "#3f51b5",
          color: "white",
        }}
        size="middle"
        onClick={handleOpen}
      >
        Create Permission
      </Button>
      <Modal
        visible={visible}
        title="Create Role's Permissions"
        okText="Create"
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
            name="role"
            label="Role"
            rules={[
              {
                required: true,
                message: "Please select a role!",
              },
            ]}
          >
            <Select placeholder="Select resource">
              {roles
                ? roles.map((item) => (
                    <Select.Option value={item.ID}>
                      {item.ROLE_NAME}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>
          <Form.Item
            name="resources"
            label="Resource"
            rules={[
              {
                required: true,
                message: "Please select a resource!",
              },
            ]}
          >
            <Select placeholder="Select resource">
              {props.resources.map((item) => (
                <Select.Option value={item.ID}>
                  {item.DESCRIPTION}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="rights"
            label="Rights"
            rules={[
              {
                required: true,
                message: "Please select at least 1 right!",
              },
            ]}
          >
            <Select mode="multiple" allowClear placeholder="Please select">
              {basicRights.map((item) => (
                <Select.Option value={item}>{item}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateRolePerm;
