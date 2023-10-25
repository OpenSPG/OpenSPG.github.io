type Props = {
  title: string;
  detail: string;
  imgUrl: string;
};

const CustomItem = (props: Props) => {
  const { title, detail, imgUrl } = props;
  return (
    <div
      style={{
        border: '1px solid rgba(47,84,235,0.20)',
        borderRadius: 8,
        backgroundColor: 'rgba(243, 247, 255, 1)',
      }}
    >
      <div
        style={{
          height: 224,
          display: 'flex',
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px 8px 0 0',
          backgroundColor: 'rgba(255, 255, 255, 1)',
        }}
      >
        <img
          src={imgUrl}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      <div
        style={{
          backgroundColor: 'rgba(243,247,255,1)',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontWeight: 500,
            fontSize: 20,
            margin: '10px 0',
          }}
        >
          {title}
        </div>
        <div style={{ color: 'rgba(0,0,0,0.45)' }}>{detail}</div>
      </div>
    </div>
  );
};

export default CustomItem;
